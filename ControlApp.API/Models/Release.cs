namespace ControlApp.API.Models
{
    public class Release
    {
        public int ReleaseId { get; set; }
        public string ReleaseName { get; set; } = null!;
        public DateTime ReleaseDate { get; set; }
        public string? Description { get; set; }

        public ICollection<Controls> Controls { get; set; } = new List<Controls>();
    }
}
