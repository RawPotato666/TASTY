namespace Tasty.Api.Dtos
{
    public class KorakPripraveCreateDto
    {
        public int ZaporednaStevilka { get; set; }
        public string Opis { get; set; } = string.Empty;
        public int? CasTrajanjaMin { get; set; }
    }
}
