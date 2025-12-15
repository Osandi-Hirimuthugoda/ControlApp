using System.ComponentModel.DataAnnotations;

namespace ControlApp.API.DTOs
{
    public class ControlDto
    {
        public int ControlId { get; set; }
        public string? Description { get; set; }
        public string? Comments { get; set; }
        public int TypeId { get; set; }
        public string? TypeName { get; set; }
        public int EmployeeId { get; set; }
        public string? EmployeeName { get; set; }
        public int? StatusId { get; set; }
        public string? StatusName { get; set; }
        public int? ReleaseId { get; set; }
        public string? ReleaseName { get; set; }
        public int Progress { get; set; }
        public DateTime? ReleaseDate { get; set; }
    }

    public class CreateControlDto
    {
        public string? Description { get; set; }
        public string? Comments { get; set; }
        
        [Required(ErrorMessage = "TypeId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "TypeId must be greater than 0")]
        public int TypeId { get; set; }
        
        [Required(ErrorMessage = "EmployeeId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "EmployeeId must be greater than 0")]
        public int EmployeeId { get; set; }
        
        public int? StatusId { get; set; }
        public int? ReleaseId { get; set; }
        
        [Range(0, 100, ErrorMessage = "Progress must be between 0 and 100")]
        public int Progress { get; set; }
        
        public DateTime? ReleaseDate { get; set; }
    }
}


