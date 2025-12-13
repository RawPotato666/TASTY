using System.Collections.Generic;

namespace Tasty.Api.Dtos
{
    public class ReceptCreateDto
    {
        public string Naslov { get; set; } = string.Empty;
        public string? Opis { get; set; }

        public int CasPripraveMin { get; set; }
        public int SteviloPorcij { get; set; }
        public bool JeJaven { get; set; }

        public int AvtorId { get; set; }

        // samo ID-ji, ne full objekti
        public List<int> KategorijaIds { get; set; } = new();
        public List<int> OznakaIds { get; set; } = new();

        public List<ReceptSestavinaCreateDto> Sestavine { get; set; } = new();
        public List<KorakPripraveCreateDto> KorakiPriprave { get; set; } = new();

        public List<SlikaReceptaCreateDto> Slike { get; set; } = new();
    }
}
