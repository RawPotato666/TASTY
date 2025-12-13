namespace Tasty.Api.Dtos
{
    public class UporabnikUpdateDto
    {
        public string Ime { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Če nočeš omogočit spreminjanja gesla tukaj, to lahko odstraniš.
        public string? Geslo { get; set; }
    }
}
