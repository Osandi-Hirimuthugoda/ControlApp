using System.ComponentModel.DataAnnotations;

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
        [Required(ErrorMessage = "ReleaseName is required")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "ReleaseName must be between 1 and 100 characters")]
        public string ReleaseName { get; set; } = null!;
        
        [Required(ErrorMessage = "ReleaseDate is required")]
        public DateTime ReleaseDate { get; set; }
        
        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }
    }
}

