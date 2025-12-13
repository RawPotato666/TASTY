namespace Tasty.Api.Models
{
    public class PriljubljenRecept
    {
        public int UporabnikId { get; set; }
        public Uporabnik Uporabnik { get; set; } = null!;

        public int ReceptId { get; set; }
        public Recept Recept { get; set; } = null!;

        public DateTime DatumDodano { get; set; }
    }
}
