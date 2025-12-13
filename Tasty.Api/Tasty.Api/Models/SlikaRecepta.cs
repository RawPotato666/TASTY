namespace Tasty.Api.Models
{
    public class SlikaRecepta
    {
        public int Id { get; set; }

        public int ReceptId { get; set; }
        public Recept Recept { get; set; } = null!;

        public string Url { get; set; } = null!;
        public string? Opis { get; set; }
        public bool JeNaslovna { get; set; }
    }
}
