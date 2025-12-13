namespace Tasty.Api.Models
{
    public class Uporabnik
    {
        public int Id { get; set; }
        public string Ime { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string GesloHash { get; set; } = string.Empty;
        public DateTime DatumRegistracije { get; set; }

        // navigacijske lastnosti
        public ICollection<Recept> Recepti { get; set; } = new List<Recept>();
        public ICollection<PriljubljenRecept> PriljubljeniRecepti { get; set; } = new List<PriljubljenRecept>();
        public ICollection<KomentarRecept> Komentarji { get; set; } = new List<KomentarRecept>();
        public ICollection<UporabnikVloga> UporabnikVloge { get; set; } = new List<UporabnikVloga>();
    }
}
