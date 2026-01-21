using System.ComponentModel.DataAnnotations;

namespace ControlApp.API.DTOs
{
    public class UpdatePhoneNumberDto
    {
        [Required(ErrorMessage = "Phone number is required")]
        [StringLength(10, ErrorMessage = "Phone number cannot exceed 10 characters")]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}












