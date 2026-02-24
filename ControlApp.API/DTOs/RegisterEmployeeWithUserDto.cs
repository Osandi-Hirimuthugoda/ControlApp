using System.ComponentModel.DataAnnotations;

namespace ControlApp.API.DTOs
{
    public class RegisterEmployeeWithUserDto
    {
        [Required(ErrorMessage = "EmployeeName is required")]
        [StringLength(100, MinimumLength = 1, ErrorMessage = "EmployeeName must be between 1 and 100 characters")]
        public string EmployeeName { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = string.Empty;
        
        [Required(ErrorMessage = "Role is required")]
        public string Role { get; set; } = string.Empty; // Software Architect, Team Leader, Developer, QA Engineer, Intern Developer, Intern QA Engineer
        
        [Required(ErrorMessage = "Phone number is required")]
        [StringLength(10, ErrorMessage = "Phone number cannot exceed 10 characters")]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [Range(1, int.MaxValue, ErrorMessage = "TypeId must be greater than 0 if provided")]
        public int? TypeId { get; set; }
        
        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }
        
        public int? TeamId { get; set; }
    }
}





