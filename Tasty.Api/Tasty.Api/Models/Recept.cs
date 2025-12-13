namespace Tasty.Api.Models
{
    public class Recept
    {
        public int Id { get; set; }
        public string Naslov { get; set; } = null!;
        public string? Opis { get; set; }
        public int CasPripraveMin { get; set; }
        public int SteviloPorcij { get; set; }
        public bool JeJaven { get; set; }
        public DateTime DatumUstvarjanja { get; set; }

        public int AvtorId { get; set; }
        public Uporabnik Avtor { get; set; } = null!;

        public ICollection<ReceptSestavina> Sestavine { get; set; } = new List<ReceptSestavina>();
        public ICollection<ReceptKategorija> Kategorije { get; set; } = new List<ReceptKategorija>();
        public ICollection<ReceptOznaka> Oznake { get; set; } = new List<ReceptOznaka>();
        public ICollection<PriljubljenRecept> PriljubljenOd { get; set; } = new List<PriljubljenRecept>();
        public ICollection<KorakPriprave> KorakiPriprave { get; set; } = new List<KorakPriprave>();
        public ICollection<KomentarRecept> Komentarji { get; set; } = new List<KomentarRecept>();
        public ICollection<SlikaRecepta> Slike { get; set; } = new List<SlikaRecepta>();
    }
}
