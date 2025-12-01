using System.ComponentModel.DataAnnotations;

namespace ControlApp.API.Models
{
    public class Release
    {
        [Key]
        public int ReleaseId { get; set; }
        public string ReleaseName { get; set; } = string.Empty;
        public DateTime ReleaseDate { get; set; }
        public string? Description { get; set; }

        public ICollection<Controls> Controls { get; set; } = new List<Controls>();
    }
}