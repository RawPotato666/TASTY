namespace Tasty.Api.Models
{
    public class ReceptKategorija
    {
        public int ReceptId { get; set; }
        public Recept Recept { get; set; } = null!;

        public int KategorijaId { get; set; }
        public Kategorija Kategorija { get; set; } = null!;
    }
}
