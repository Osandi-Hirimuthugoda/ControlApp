using System.ComponentModel.DataAnnotations;

namespace ControlApp.API.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Username is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Username must be between 3 and 100 characters")]
        public string Username { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email address")]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
        public string Password { get; set; } = string.Empty;

        [StringLength(100)]
        public string? FullName { get; set; }

        [Required(ErrorMessage = "Role is required")]
        [RegularExpression("^(Admin|Employee)$", ErrorMessage = "Role must be either Admin or Employee")]
        public string Role { get; set; } = "Employee";
    }
}





