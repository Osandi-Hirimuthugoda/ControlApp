using System.ComponentModel.DataAnnotations;

namespace ControlApp.API.DTOs
{
    public class UpdateControlDto
    {
        [Required]
        public int ControlId { get; set; } 
        
        [Required]
        public int EmployeeId { get; set; } 

        public int? TypeId { get; set; }
        public string? Description { get; set; }
        public string? Comments { get; set; }
        
        [Range(0, 100)]
        public int Progress { get; set; }

        public int? StatusId { get; set; }
        public int? ReleaseId { get; set; }
        public DateTime? ReleaseDate { get; set; }
    }
}