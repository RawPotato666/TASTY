using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasty.Api.Data;
using Tasty.Api.Dtos;
using Tasty.Api.Models;

namespace Tasty.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KategorijeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KategorijeController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Kategorije
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KategorijaDto>>> GetKategorije()
        {
            var kategorije = await _context.Kategorije
                .AsNoTracking()
                .Select(k => new KategorijaDto
                {
                    Id = k.Id,
                    Ime = k.Ime
                })
                .ToListAsync();

            return Ok(kategorije);
        }

        // GET: api/Kategorije/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<KategorijaDto>> GetKategorija(int id)
        {
            var k = await _context.Kategorije
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (k == null)
                return NotFound();

            return new KategorijaDto
            {
                Id = k.Id,
                Ime = k.Ime
            };
        }

        // POST: api/Kategorije
        // Body: { "ime": "Glavna jed" }
        [HttpPost]
        public async Task<ActionResult<KategorijaDto>> CreateKategorija([FromBody] KategorijaCreateDto dto)
        {
            var kategorija = new Kategorija
            {
                Ime = dto.Ime
            };

            _context.Kategorije.Add(kategorija);
            await _context.SaveChangesAsync();

            var result = new KategorijaDto
            {
                Id = kategorija.Id,
                Ime = kategorija.Ime
            };

            return CreatedAtAction(nameof(GetKategorija), new { id = kategorija.Id }, result);
        }

        // PUT: api/Kategorije/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateKategorija(int id, [FromBody] KategorijaUpdateDto dto)
        {
            var kategorija = await _context.Kategorije.FindAsync(id);
            if (kategorija == null)
                return NotFound();

            kategorija.Ime = dto.Ime;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Kategorije/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteKategorija(int id)
        {
            var kategorija = await _context.Kategorije.FindAsync(id);
            if (kategorija == null)
                return NotFound();

            _context.Kategorije.Remove(kategorija);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
