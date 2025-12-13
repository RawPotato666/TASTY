using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasty.Api.Data;
using Tasty.Api.Dtos;
using Tasty.Api.Models;

namespace Tasty.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OznakeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OznakeController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Oznake
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OznakaDto>>> GetOznake()
        {
            var oznake = await _context.Oznake
                .AsNoTracking()
                .Select(o => new OznakaDto
                {
                    Id = o.Id,
                    Ime = o.Ime
                })
                .ToListAsync();

            return Ok(oznake);
        }

        // GET: api/Oznake/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<OznakaDto>> GetOznaka(int id)
        {
            var o = await _context.Oznake
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (o == null)
                return NotFound();

            return new OznakaDto
            {
                Id = o.Id,
                Ime = o.Ime
            };
        }

        // POST: api/Oznake
        // Swagger body bo: { "ime": "Pasta" }
        [HttpPost]
        public async Task<ActionResult<OznakaDto>> CreateOznaka([FromBody] OznakaCreateDto dto)
        {
            var oznaka = new Oznaka
            {
                Ime = dto.Ime
            };

            _context.Oznake.Add(oznaka);
            await _context.SaveChangesAsync();

            var result = new OznakaDto
            {
                Id = oznaka.Id,
                Ime = oznaka.Ime
            };

            return CreatedAtAction(nameof(GetOznaka), new { id = oznaka.Id }, result);
        }

        // PUT: api/Oznake/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateOznaka(int id, [FromBody] OznakaUpdateDto dto)
        {
            var oznaka = await _context.Oznake.FindAsync(id);
            if (oznaka == null)
                return NotFound();

            oznaka.Ime = dto.Ime;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Oznake/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteOznaka(int id)
        {
            var oznaka = await _context.Oznake.FindAsync(id);
            if (oznaka == null)
                return NotFound();

            _context.Oznake.Remove(oznaka);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
