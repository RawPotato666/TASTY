using System.Collections.Generic;

namespace Tasty.Api.Dtos
{
    public class ReceptUpdateDto
    {
        public string Naslov { get; set; } = string.Empty;
        public string? Opis { get; set; }
        public int CasPripraveMin { get; set; }
        public int SteviloPorcij { get; set; }
        public bool JeJaven { get; set; }


        public List<int>? KategorijaIds { get; set; }
        public List<int>? OznakaIds { get; set; }

        public List<ReceptSestavinaCreateDto>? Sestavine { get; set; }
        public List<KorakPripraveCreateDto>? KorakiPriprave { get; set; }
        public List<SlikaReceptaCreateDto>? Slike { get; set; }
    }
}
