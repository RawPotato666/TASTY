namespace Tasty.Api.Models
{
    public class Sestavina
    {
        public int Id { get; set; }
        public string Ime { get; set; } = null!;

        public ICollection<ReceptSestavina> Recepti { get; set; } = new List<ReceptSestavina>();
    }
}
