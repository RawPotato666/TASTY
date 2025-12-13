namespace Tasty.Api.Models
{
    public class Vloga
    {
        public int Id { get; set; }
        public string Naziv { get; set; } = null!;

        public ICollection<UporabnikVloga> UporabnikVloge { get; set; } = new List<UporabnikVloga>();
    }
}
