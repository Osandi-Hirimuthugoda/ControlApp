using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControlApp.API.Models
{
    public class Employee
    {
        [Key]
        public int Id { get; set; } 

        public string EmployeeName { get; set; } = string.Empty;

        public int? TypeId { get; set; }
        public string? Description { get; set; }
        
        public int? UserId { get; set; }

        [ForeignKey("TypeId")]
        public ControlType? Type { get; set; }
        
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public ICollection<Controls> Controls { get; set; } = new List<Controls>();
    }
}