namespace Tasty.Api.Dtos
{
    public class UporabnikDto
    {
        public int Id { get; set; }
        public string Ime { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime DatumRegistracije { get; set; }
    }
}
