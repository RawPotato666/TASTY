namespace Tasty.Api.Models
{
    public class Oznaka
    {
        public int Id { get; set; }
        public string Ime { get; set; } = null!;

        public ICollection<ReceptOznaka> Recepti { get; set; } = new List<ReceptOznaka>();
    }
}
