namespace Tasty.Api.Models
{
    public class Kategorija
    {
        public int Id { get; set; }
        public string Ime { get; set; } = null!;

        public ICollection<ReceptKategorija> Recepti { get; set; } = new List<ReceptKategorija>();
    }
}
