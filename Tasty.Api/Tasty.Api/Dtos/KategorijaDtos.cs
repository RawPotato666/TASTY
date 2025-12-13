namespace Tasty.Api.Dtos
{
    public class KategorijaCreateDto
    {
        public string Ime { get; set; } = string.Empty;
    }

    public class KategorijaUpdateDto
    {
        public string Ime { get; set; } = string.Empty;
    }

    public class KategorijaDto
    {
        public int Id { get; set; }
        public string Ime { get; set; } = string.Empty;
    }
}
