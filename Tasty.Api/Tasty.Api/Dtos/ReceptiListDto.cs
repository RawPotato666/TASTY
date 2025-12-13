namespace Tasty.Api.Dtos
{
    public class ReceptListDto
    {
        public int Id { get; set; }
        public string Naslov { get; set; } = string.Empty;
        public string? Opis { get; set; }
        public int CasPripraveMin { get; set; }
        public int SteviloPorcij { get; set; }

        public string? NaslovnaSlikaUrl { get; set; }
        public bool JeJaven { get; set; }
        public int AvtorId { get; set; }
        public string AvtorIme { get; set; } = string.Empty;

        public List<string> Kategorije { get; set; } = new();
        public List<string> Oznake { get; set; } = new();
    }
}
