namespace Tasty.Api.Models
{
    public class UporabnikVloga
    {
        public int UporabnikId { get; set; }
        public Uporabnik Uporabnik { get; set; } = null!;

        public int VlogaId { get; set; }
        public Vloga Vloga { get; set; } = null!;
    }
}
