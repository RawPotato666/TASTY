namespace Tasty.Api.Models
{
    public class KomentarRecept
    {
        public int Id { get; set; }

        public int ReceptId { get; set; }
        public Recept Recept { get; set; } = null!;

        public int UporabnikId { get; set; }
        public Uporabnik Uporabnik { get; set; } = null!;

        public string Besedilo { get; set; } = null!;
        public int? Ocena { get; set; }   // 1–5, lahko null
        public DateTime Datum { get; set; }
    }
}
