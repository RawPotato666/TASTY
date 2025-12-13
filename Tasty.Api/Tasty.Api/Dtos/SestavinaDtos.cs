namespace Tasty.Api.Dtos
{
    public class SestavinaCreateDto
    {
        public string Ime { get; set; } = string.Empty;
    }

    public class SestavinaUpdateDto
    {
        public string Ime { get; set; } = string.Empty;
    }

    public class SestavinaDto
    {
        public int Id { get; set; }
        public string Ime { get; set; } = string.Empty;
    }
}
