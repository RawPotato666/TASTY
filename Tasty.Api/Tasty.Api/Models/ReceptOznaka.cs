namespace Tasty.Api.Models
{
    public class ReceptOznaka
    {
        public int ReceptId { get; set; }
        public Recept Recept { get; set; } = null!;

        public int OznakaId { get; set; }
        public Oznaka Oznaka { get; set; } = null!;
    }
}
