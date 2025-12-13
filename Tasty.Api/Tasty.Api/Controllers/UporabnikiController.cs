using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasty.Api.Data;
using Tasty.Api.Dtos;
using Tasty.Api.Models;

namespace Tasty.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UporabnikiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UporabnikiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Uporabniki
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UporabnikDto>>> GetUporabniki()
        {
            var uporabniki = await _context.Uporabniki
                .AsNoTracking()
                .Select(u => new UporabnikDto
                {
                    Id = u.Id,
                    Ime = u.Ime,
                    Email = u.Email,
                    DatumRegistracije = u.DatumRegistracije
                })
                .ToListAsync();

            return Ok(uporabniki);
        }

        // GET: api/Uporabniki/5
        [HttpGet("{id:int}")]
        public async Task<ActionResult<UporabnikDto>> GetUporabnik(int id)
        {
            var u = await _context.Uporabniki
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);

            if (u == null)
                return NotFound();

            var dto = new UporabnikDto
            {
                Id = u.Id,
                Ime = u.Ime,
                Email = u.Email,
                DatumRegistracije = u.DatumRegistracije
            };

            return Ok(dto);
        }

        // POST: api/Uporabniki
        // Body bo zdaj kratek: { "ime": "...", "email": "...", "geslo": "..." }
        [HttpPost]
        public async Task<ActionResult<UporabnikDto>> CreateUporabnik([FromBody] UporabnikCreateDto dto)
        {
            // TODO: tukaj bi moral geslo hashirati (npr. z PBKDF2/bcrypt).
            // Za zdaj samo demonstracija.
            var uporabnik = new Uporabnik
            {
                Ime = dto.Ime,
                Email = dto.Email,
                GesloHash = dto.Geslo, // kasneje zamenjaš z hashom
                DatumRegistracije = DateTime.UtcNow
            };

            _context.Uporabniki.Add(uporabnik);
            await _context.SaveChangesAsync();

            var result = new UporabnikDto
            {
                Id = uporabnik.Id,
                Ime = uporabnik.Ime,
                Email = uporabnik.Email,
                DatumRegistracije = uporabnik.DatumRegistracije
            };

            return CreatedAtAction(nameof(GetUporabnik), new { id = uporabnik.Id }, result);
        }

        // PUT: api/Uporabniki/5
        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateUporabnik(int id, [FromBody] UporabnikUpdateDto dto)
        {
            var uporabnik = await _context.Uporabniki.FindAsync(id);
            if (uporabnik == null)
                return NotFound();

            uporabnik.Ime = dto.Ime;
            uporabnik.Email = dto.Email;

            if (!string.IsNullOrWhiteSpace(dto.Geslo))
            {
                // TODO: hash gesla, ne shranjuj plain text
                uporabnik.GesloHash = dto.Geslo;
            }

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Uporabniki/5
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteUporabnik(int id)
        {
            var uporabnik = await _context.Uporabniki.FindAsync(id);
            if (uporabnik == null)
                return NotFound();

            _context.Uporabniki.Remove(uporabnik);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
