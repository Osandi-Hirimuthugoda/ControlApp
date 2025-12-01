using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControlApp.API.Models
{
    public class Controls
    {
        [Key]
        public int ControlId { get; set; }

        
        public string? Description { get; set; } 
        public string? Comments { get; set; }

        
        public int Progress { get; set; } = 0; 
        public DateTime? ReleaseDate { get; set; } 

        
        public int TypeId { get; set; }
        public int EmployeeId { get; set; }
        
        
        public int? StatusId { get; set; }
        public int? ReleaseId { get; set; }

        
        [ForeignKey("TypeId")]
        public ControlType? Type { get; set; }
        
        [ForeignKey("EmployeeId")]
        public Employee? Employee { get; set; }
        
        [ForeignKey("StatusId")]
        public Status? Status { get; set; }
        
        [ForeignKey("ReleaseId")]
        public Release? Release { get; set; }
    }
}