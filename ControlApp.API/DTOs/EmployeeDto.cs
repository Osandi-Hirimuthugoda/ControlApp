using System.ComponentModel.DataAnnotations;

namespace ControlApp.API.DTOs
{
    public class EmployeeDto
    {
        public int Id { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty; 
        public string? PhoneNumber { get; set; }
        public string Role { get; set; } = string.Empty;
        public int? TypeId { get; set; }
        public string? TypeName { get; set; }
        public string? Description { get; set; }
        public int? TeamId { get; set; }
        public string? TeamName { get; set; }
    }

    public class CreateEmployeeDto
    {
        [Required(ErrorMessage = "EmployeeName is required")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "EmployeeName must be between 1 and 100 characters")]
        public string EmployeeName { get; set; } = null!;
        
        [Range(1, int.MaxValue, ErrorMessage = "TypeId must be greater than 0 if provided")]
        public int? TypeId { get; set; }
        
        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }
        
        public int? TeamId { get; set; }
    }

    public class CreateEmployeeWithControlDto
    {
        [Required(ErrorMessage = "EmployeeName is required")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "EmployeeName must be between 1 and 100 characters")]
        public string EmployeeName { get; set; } = string.Empty;
        
        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }
        
        [Range(1, int.MaxValue, ErrorMessage = "TypeId must be greater than 0 if provided")]
        public int? TypeId { get; set; }
    }
}