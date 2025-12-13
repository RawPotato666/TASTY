using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasty.Api.Data;
using Tasty.Api.Models;

namespace Tasty.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KomentarjiReceptovController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KomentarjiReceptovController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/komentarjireceptov/recept/5
        [HttpGet("recept/{receptId:int}")]
        public async Task<ActionResult<IEnumerable<KomentarRecept>>> GetByRecept(int receptId)
        {
            return await _context.KomentarjiReceptov
                .Where(k => k.ReceptId == receptId)
                .Include(k => k.Uporabnik)
                .OrderByDescending(k => k.Datum)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<KomentarRecept>> Create(KomentarRecept komentar)
        {
            komentar.Datum = DateTime.UtcNow;
            _context.KomentarjiReceptov.Add(komentar);
            await _context.SaveChangesAsync();
            return komentar;
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var k = await _context.KomentarjiReceptov.FindAsync(id);
            if (k == null) return NotFound();

            _context.KomentarjiReceptov.Remove(k);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
