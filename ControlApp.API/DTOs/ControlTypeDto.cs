using System.ComponentModel.DataAnnotations;

namespace ControlApp.API.DTOs
{
    public class ControlTypeDto
    {
        public int ControlTypeId { get; set; }
        public string TypeName { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime? ReleaseDate { get; set; }
    }

    public class CreateControlTypeDto
    {
        [Required(ErrorMessage = "TypeName is required")]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "TypeName must be between 1 and 50 characters")]
        public string TypeName { get; set; } = null!;
        
        [Required(ErrorMessage = "Description is required")]
        [StringLength(500, MinimumLength = 1, ErrorMessage = "Description must be between 1 and 500 characters")]
        public string Description { get; set; } = null!;
        
        public DateTime? ReleaseDate { get; set; }
    }
}