namespace Tasty.Api.Dtos
{
    public class UporabnikCreateDto
    {
        public string Ime { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;

        // Zaenkrat ga imenujem Geslo, ker je logično za API.
        // V modelu ga potem pretvoriš v GesloHash.
        public string Geslo { get; set; } = string.Empty;
    }
}
