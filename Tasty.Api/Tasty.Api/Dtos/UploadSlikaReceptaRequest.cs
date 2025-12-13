using Microsoft.AspNetCore.Http;

namespace Tasty.Api.Dtos
{
    public class UploadSlikaReceptaRequest
    {
        public IFormFile File { get; set; } = null!;
        public string? Opis { get; set; }
        public bool JeNaslovna { get; set; } = false;
    }
}
