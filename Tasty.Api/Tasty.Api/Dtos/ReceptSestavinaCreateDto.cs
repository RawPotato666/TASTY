namespace Tasty.Api.Dtos
{
    public class ReceptSestavinaCreateDto
    {
        public int SestavinaId { get; set; }
        public string Kolicina { get; set; } = string.Empty;
        public string? Opomba { get; set; }
    }
}
