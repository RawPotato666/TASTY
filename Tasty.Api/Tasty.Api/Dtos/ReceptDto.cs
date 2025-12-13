using System;
using System.Collections.Generic;

namespace Tasty.Api.Dtos
{
    public class ReceptDto
    {
        public int Id { get; set; }
        public string Naslov { get; set; } = string.Empty;
        public string? Opis { get; set; }
        public int CasPripraveMin { get; set; }
        public int SteviloPorcij { get; set; }
        public bool JeJaven { get; set; }
        public DateTime DatumUstvarjanja { get; set; }

        public int AvtorId { get; set; }
        public string AvtorIme { get; set; } = string.Empty;

        public List<string> Kategorije { get; set; } = new();
        public List<string> Oznake { get; set; } = new();

        public List<ReceptSestavinaDto> Sestavine { get; set; } = new();
        public List<KorakPripraveDto> KorakiPriprave { get; set; } = new();
        public List<SlikaReceptaDto> Slike { get; set; } = new();
    }

    public class ReceptSestavinaDto
    {
        public int SestavinaId { get; set; }
        public string SestavinaIme { get; set; } = string.Empty;
        public string? Kolicina { get; set; }
        public string? Opomba { get; set; }
    }

    public class KorakPripraveDto
    {
        public int Id { get; set; }
        public int ZaporednaStevilka { get; set; }
        public string Opis { get; set; } = string.Empty;
        public int? CasTrajanjaMin { get; set; }
    }

    public class SlikaReceptaDto
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public string? Opis { get; set; }
        public bool JeNaslovna { get; set; }
    }
}
