using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasty.Api.Data;
using Tasty.Api.Dtos;
using Tasty.Api.Models;

namespace Tasty.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SestavineController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SestavineController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Sestavine
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SestavinaDto>>> GetSestavine()
        {
            var sestavine = await _context.Sestavine
                .AsNoTracking()
                .Select(s => new SestavinaDto
                {
                    Id = s.Id,
                    Ime = s.Ime
                })
                .ToListAsync();

            return Ok(sestavine);
        }

        // GET: api/Sestavine/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<SestavinaDto>> GetSestavina(int id)
        {
            var s = await _context.Sestavine
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (s == null)
                return NotFound();

            return new SestavinaDto
            {
                Id = s.Id,
                Ime = s.Ime
            };
        }

        // POST: api/Sestavine
        // Body: { "ime": "Špageti" }
        [HttpPost]
        public async Task<ActionResult<SestavinaDto>> CreateSestavina([FromBody] SestavinaCreateDto dto)
        {
            var sestavina = new Sestavina
            {
                Ime = dto.Ime
            };

            _context.Sestavine.Add(sestavina);
            await _context.SaveChangesAsync();

            var result = new SestavinaDto
            {
                Id = sestavina.Id,
                Ime = sestavina.Ime
            };

            return CreatedAtAction(nameof(GetSestavina), new { id = sestavina.Id }, result);
        }

        // PUT: api/Sestavine/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateSestavina(int id, [FromBody] SestavinaUpdateDto dto)
        {
            var sestavina = await _context.Sestavine.FindAsync(id);
            if (sestavina == null)
                return NotFound();

            sestavina.Ime = dto.Ime;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Sestavine/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteSestavina(int id)
        {
            var sestavina = await _context.Sestavine.FindAsync(id);
            if (sestavina == null)
                return NotFound();

            _context.Sestavine.Remove(sestavina);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
