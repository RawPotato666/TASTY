using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Tasty.Api.Data;
using Tasty.Api.Dtos;
using Tasty.Api.Models;

namespace Tasty.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReceptiController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ReceptiController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // GET /api/Recepti
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReceptListDto>>> GetRecepti()
        {
            var recepti = await _context.Recepti
                .Include(r => r.Avtor)
                .Include(r => r.Slike)
                .Include(r => r.Kategorije).ThenInclude(rk => rk.Kategorija)
                .Include(r => r.Oznake).ThenInclude(ro => ro.Oznaka)
                .AsNoTracking()
                .ToListAsync();

            var result = recepti.Select(r => new ReceptListDto
            {
                Id = r.Id,
                Naslov = r.Naslov,
                Opis = r.Opis,
                CasPripraveMin = r.CasPripraveMin,
                SteviloPorcij = r.SteviloPorcij,
                JeJaven = r.JeJaven,
                AvtorId = r.AvtorId,
                AvtorIme = r.Avtor.Ime,
                NaslovnaSlikaUrl =
                    r.Slike.FirstOrDefault(s => s.JeNaslovna)?.Url
                    ?? r.Slike.FirstOrDefault()?.Url,
                Kategorije = r.Kategorije.Select(k => k.Kategorija.Ime).ToList(),
                Oznake = r.Oznake.Select(o => o.Oznaka.Ime).ToList()
            }).ToList();

            return Ok(result);
        }

        // GET /api/Recepti/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ReceptDto>> GetReceptById(int id)
        {
            var recept = await _context.Recepti
                .Include(r => r.Slike)
                .Include(r => r.KorakiPriprave)
                .Include(r => r.Sestavine).ThenInclude(rs => rs.Sestavina)
                .Include(r => r.Kategorije).ThenInclude(rk => rk.Kategorija)
                .Include(r => r.Oznake).ThenInclude(ro => ro.Oznaka)
                .Include(r => r.Avtor)
                .AsNoTracking()
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recept == null) return NotFound();

            var dto = new ReceptDto
            {
                Id = recept.Id,
                Naslov = recept.Naslov,
                Opis = recept.Opis,
                CasPripraveMin = recept.CasPripraveMin,
                SteviloPorcij = recept.SteviloPorcij,
                JeJaven = recept.JeJaven,
                DatumUstvarjanja = recept.DatumUstvarjanja,
                AvtorId = recept.AvtorId,
                AvtorIme = recept.Avtor.Ime,
                Kategorije = recept.Kategorije.Select(k => k.Kategorija.Ime).ToList(),
                Oznake = recept.Oznake.Select(o => o.Oznaka.Ime).ToList(),
                Sestavine = recept.Sestavine.Select(rs => new ReceptSestavinaDto
                {
                    SestavinaId = rs.SestavinaId,
                    SestavinaIme = rs.Sestavina.Ime,
                    Kolicina = rs.Kolicina,
                    Opomba = rs.Opomba
                }).ToList(),
                KorakiPriprave = recept.KorakiPriprave
                    .OrderBy(k => k.ZaporednaStevilka)
                    .Select(k => new KorakPripraveDto
                    {
                        Id = k.Id,
                        ZaporednaStevilka = k.ZaporednaStevilka,
                        Opis = k.Opis,
                        CasTrajanjaMin = k.CasTrajanjaMin
                    }).ToList(),
                Slike = recept.Slike.Select(s => new SlikaReceptaDto
                {
                    Id = s.Id,
                    Url = s.Url,
                    Opis = s.Opis,
                    JeNaslovna = s.JeNaslovna
                }).ToList()
            };

            return Ok(dto);
        }

        // POST /api/Recepti
        [HttpPost]
        public async Task<ActionResult> CreateRecept([FromBody] ReceptCreateDto dto)
        {
            var recept = new Recept
            {
                Naslov = dto.Naslov,
                Opis = dto.Opis,
                CasPripraveMin = dto.CasPripraveMin,
                SteviloPorcij = dto.SteviloPorcij,
                JeJaven = dto.JeJaven,
                DatumUstvarjanja = DateTime.UtcNow,
                AvtorId = dto.AvtorId
            };

            recept.Sestavine = dto.Sestavine.Select(s => new ReceptSestavina
            {
                SestavinaId = s.SestavinaId,
                Kolicina = s.Kolicina,
                Opomba = s.Opomba
            }).ToList();

            recept.KorakiPriprave = dto.KorakiPriprave.Select(k => new KorakPriprave
            {
                ZaporednaStevilka = k.ZaporednaStevilka,
                Opis = k.Opis,
                CasTrajanjaMin = k.CasTrajanjaMin
            }).ToList();

            recept.Kategorije = dto.KategorijaIds.Select(id => new ReceptKategorija
            {
                KategorijaId = id
            }).ToList();

            recept.Oznake = dto.OznakaIds.Select(id => new ReceptOznaka
            {
                OznakaId = id
            }).ToList();

            if (dto.Slike != null && dto.Slike.Count > 0)
            {
                // če kdaj pošlješ URL-je ob kreiranju, jih normalno shrani
                recept.Slike = dto.Slike.Select(s => new SlikaRecepta
                {
                    Url = s.Url,
                    Opis = s.Opis,
                    JeNaslovna = s.JeNaslovna
                }).ToList();
            }

            _context.Recepti.Add(recept);
            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetReceptById),
                new { id = recept.Id },
                new { id = recept.Id }
            );
        }

        // model za upload (za Swagger)
        public class UploadSlikaReceptaRequest
        {
            public IFormFile File { get; set; } = null!;
            public string? Opis { get; set; }
            public bool JeNaslovna { get; set; } = false;
        }

        // POST /api/Recepti/{id}/slike – upload slike (multipart/form-data)
        /// <summary>
        /// Naloži slikovno datoteko za recept.
        /// </summary>
        /// <remarks>
        /// Content-Type: multipart/form-data
        /// 
        /// Body (form-data):
        /// - file: slikovna datoteka
        /// - opis: opcijsko
        /// - jeNaslovna: true/false
        /// </remarks>
        [HttpPost("{id:int}/slike")]
        [Consumes("multipart/form-data")]
        [RequestSizeLimit(10_000_000)] // ~10MB
        public async Task<ActionResult<SlikaReceptaDto>> UploadSlika(
            int id,
            [FromForm] UploadSlikaReceptaRequest request)
        {
            var recept = await _context.Recepti
                .Include(r => r.Slike)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recept == null) return NotFound("Recept ne obstaja.");

            if (request.File == null || request.File.Length == 0)
                return BadRequest("Datoteka je prazna.");

            var webRoot = _env.WebRootPath ?? Path.Combine(_env.ContentRootPath, "wwwroot");
            var imagesRoot = Path.Combine(webRoot, "images");
            if (!Directory.Exists(imagesRoot))
            {
                Directory.CreateDirectory(imagesRoot);
            }

            var ext = Path.GetExtension(request.File.FileName);
            var fileName = $"{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(imagesRoot, fileName);

            await using (var stream = System.IO.File.Create(fullPath))
            {
                await request.File.CopyToAsync(stream);
            }

            // absolutni URL na to isto aplikacijo
            var scheme = Request.Scheme;
            var host = Request.Host.Value;
            var absoluteUrl = $"{scheme}://{host}/images/{fileName}";

            if (request.JeNaslovna)
            {
                foreach (var s in recept.Slike)
                {
                    s.JeNaslovna = false;
                }
            }

            var slika = new SlikaRecepta
            {
                ReceptId = id,
                Url = absoluteUrl,
                Opis = request.Opis,
                JeNaslovna = request.JeNaslovna
            };

            _context.SlikeReceptov.Add(slika);
            await _context.SaveChangesAsync();

            var dto = new SlikaReceptaDto
            {
                Id = slika.Id,
                Url = slika.Url,
                Opis = slika.Opis,
                JeNaslovna = slika.JeNaslovna
            };

            return CreatedAtAction(nameof(GetReceptById), new { id }, dto);
        }
        [HttpDelete("{id:int}")]
public async Task<IActionResult> DeleteRecept(int id, [FromQuery] int uporabnikId)
{
    var recept = await _context.Recepti
        .FirstOrDefaultAsync(r => r.Id == id);

    if (recept == null)
        return NotFound("Recept ne obstaja.");

    if (recept.AvtorId != uporabnikId)
        return Forbid("Recept lahko izbriše samo njegov avtor.");

    _context.Recepti.Remove(recept);
    await _context.SaveChangesAsync();

    return NoContent();
}
    }
}
