using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ControlApp.API.Models
{
    public class Controls
    {
        [Key]
        public int ControlId { get; set; }

        
        public string? Description { get; set; } 
        public string? SubDescriptions { get; set; }
        public string? Comments { get; set; }

        
        public int Progress { get; set; } = 0; 
        public string? StatusProgress { get; set; } // JSON map of StatusId to Progress
        public DateTime? ReleaseDate { get; set; } 

        
        public int TypeId { get; set; }
        public int? EmployeeId { get; set; }
        public int? QAEmployeeId { get; set; } // QA Engineer assigned to this control
        
        
        public int? StatusId { get; set; }
        public int? ReleaseId { get; set; }

        
        [ForeignKey("TypeId")]
        public ControlType? Type { get; set; }
        
        [ForeignKey("EmployeeId")]
        public Employee? Employee { get; set; }
        
        [ForeignKey("QAEmployeeId")]
        public Employee? QAEmployee { get; set; }
        
        [ForeignKey("StatusId")]
        public Status? Status { get; set; }
        
        [ForeignKey("ReleaseId")]
        public Release? Release { get; set; }

        public DateTime? UpdatedAt { get; set; }

        // Team-related properties
        public int? TeamId { get; set; }
        
        [ForeignKey("TeamId")]
        public Team? Team { get; set; }
    }
}