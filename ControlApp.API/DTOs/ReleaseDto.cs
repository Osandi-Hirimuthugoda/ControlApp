namespace ControlApp.API.DTOs
{
    public class ReleaseDto
    {
        public int ReleaseId { get; set; }
        public string ReleaseName { get; set; } = null!;
        public DateTime ReleaseDate { get; set; }
        public string? Description { get; set; }
    }

    public class CreateReleaseDto
    {
        public string ReleaseName { get; set; } = null!;
        public DateTime ReleaseDate { get; set; }
        public string? Description { get; set; }
    }
}

