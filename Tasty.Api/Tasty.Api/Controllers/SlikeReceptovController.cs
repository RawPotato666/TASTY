using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasty.Api.Data;
using Tasty.Api.Models;

namespace Tasty.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SlikeReceptovController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SlikeReceptovController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("recept/{receptId:int}")]
        public async Task<ActionResult<IEnumerable<SlikaRecepta>>> GetByRecept(int receptId)
        {
            return await _context.SlikeReceptov
                .Where(s => s.ReceptId == receptId)
                .ToListAsync();
        }

        // skrito iz Swaggerja
        [HttpPost]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<ActionResult<SlikaRecepta>> Create(SlikaRecepta slika)
        {
            _context.SlikeReceptov.Add(slika);
            await _context.SaveChangesAsync();
            return slika;
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var s = await _context.SlikeReceptov.FindAsync(id);
            if (s == null) return NotFound();

            _context.SlikeReceptov.Remove(s);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
