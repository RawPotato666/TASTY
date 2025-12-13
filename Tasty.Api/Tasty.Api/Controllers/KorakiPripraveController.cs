using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasty.Api.Data;
using Tasty.Api.Models;

namespace Tasty.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KorakiPripraveController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KorakiPripraveController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/korakipriprave/recept/5
        [HttpGet("recept/{receptId:int}")]
        public async Task<ActionResult<IEnumerable<KorakPriprave>>> GetByRecept(int receptId)
        {
            return await _context.KorakiPriprave
                .Where(k => k.ReceptId == receptId)
                .OrderBy(k => k.ZaporednaStevilka)
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<KorakPriprave>> Create(KorakPriprave korak)
        {
            _context.KorakiPriprave.Add(korak);
            await _context.SaveChangesAsync();
            return korak;
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var k = await _context.KorakiPriprave.FindAsync(id);
            if (k == null) return NotFound();

            _context.KorakiPriprave.Remove(k);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
