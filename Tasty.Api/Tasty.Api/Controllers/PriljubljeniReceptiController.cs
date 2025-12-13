using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasty.Api.Data;
using Tasty.Api.Models;

namespace Tasty.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PriljubljeniReceptiController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PriljubljeniReceptiController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/priljubljenirecepti/1  (za uporabnika 1)
        [HttpGet("{uporabnikId:int}")]
        public async Task<ActionResult<IEnumerable<PriljubljenRecept>>> GetPriljubljeni(int uporabnikId)
        {
            return await _context.PriljubljeniRecepti
                .Where(pr => pr.UporabnikId == uporabnikId)
                .Include(pr => pr.Recept)
                .ToListAsync();
        }

        // POST: api/priljubljenirecepti
        [HttpPost]
        public async Task<IActionResult> AddPriljubljen(PriljubljenRecept request)
        {
            _context.PriljubljeniRecepti.Add(request);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // DELETE: api/priljubljenirecepti/1/5
        [HttpDelete("{uporabnikId:int}/{receptId:int}")]
        public async Task<IActionResult> RemovePriljubljen(int uporabnikId, int receptId)
        {
            var pr = await _context.PriljubljeniRecepti
                .FindAsync(uporabnikId, receptId);
            if (pr == null) return NotFound();

            _context.PriljubljeniRecepti.Remove(pr);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
