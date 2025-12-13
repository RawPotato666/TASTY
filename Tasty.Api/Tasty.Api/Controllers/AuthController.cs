using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasty.Api.Data;
using Tasty.Api.Dtos;

namespace Tasty.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Geslo { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UporabnikDto>> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Geslo))
                return BadRequest("Email in geslo sta obvezna.");

            var user = await _context.Uporabniki
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.GesloHash != request.Geslo)
            {
                await Task.Delay(200);
                return Unauthorized("Napačen email ali geslo.");
            }

            var dto = new UporabnikDto
            {
                Id = user.Id,
                Ime = user.Ime,
                Email = user.Email,
                DatumRegistracije = user.DatumRegistracije
            };

            return Ok(dto);
        }
    }
}
