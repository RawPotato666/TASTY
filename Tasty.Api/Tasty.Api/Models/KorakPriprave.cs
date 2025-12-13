namespace Tasty.Api.Models
{
    public class KorakPriprave
    {
        public int Id { get; set; }
        public int ReceptId { get; set; }
        public Recept Recept { get; set; } = null!;
        public int ZaporednaStevilka { get; set; }
        public string Opis { get; set; } = null!;
        public int? CasTrajanjaMin { get; set; }
    }
}
