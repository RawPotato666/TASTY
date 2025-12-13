namespace Tasty.Api.Dtos
{
    public class OznakaCreateDto
    {
        public string Ime { get; set; } = string.Empty;
    }

    public class OznakaUpdateDto
    {
        public string Ime { get; set; } = string.Empty;
    }

    public class OznakaDto
    {
        public int Id { get; set; }
        public string Ime { get; set; } = string.Empty;
    }
}
