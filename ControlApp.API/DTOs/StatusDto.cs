using System.ComponentModel.DataAnnotations;

namespace ControlApp.API.DTOs
{
    public class StatusDto
    {
        public int Id { get; set; }
        public string StatusName { get; set; } = null!;
    }

    public class CreateStatusDto
    {
        [Required(ErrorMessage = "StatusName is required")]
        [StringLength(50, MinimumLength = 1, ErrorMessage = "StatusName must be between 1 and 50 characters")]
        public string StatusName { get; set; } = null!;
    }
}
