namespace Tasty.Api.Dtos
{
    public class SlikaReceptaCreateDto
    {
        public string Url { get; set; } = string.Empty;
        public string? Opis { get; set; }
        public bool JeNaslovna { get; set; }
    }
}
