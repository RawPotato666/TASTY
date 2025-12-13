using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasty.Api.Data;
using Tasty.Api.Models;

namespace Tasty.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VlogeController : ControllerBase
    {
        private readonly AppDbContext _context;

        public VlogeController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Vloga>>> GetVloge()
        {
            return await _context.Vloge.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Vloga>> CreateVloga(Vloga vloga)
        {
            _context.Vloge.Add(vloga);
            await _context.SaveChangesAsync();
            return vloga;
        }
    }
}
