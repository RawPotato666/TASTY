namespace Tasty.Api.Models
{
    public class ReceptSestavina
    {
        public int ReceptId { get; set; }
        public Recept Recept { get; set; } = null!;

        public int SestavinaId { get; set; }
        public Sestavina Sestavina { get; set; } = null!;

        public string Kolicina { get; set; } = null!;
        public string? Opomba { get; set; }
    }
}
