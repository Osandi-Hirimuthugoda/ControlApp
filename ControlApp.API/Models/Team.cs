using System;
using System.ComponentModel.DataAnnotations;

namespace ControlApp.API.Models
{
    public class Team
    {
        [Key]
        public int TeamId { get; set; }

        [Required]
        [MaxLength(100)]
        public string TeamName { get; set; }

        [Required]
        [MaxLength(20)]
        public string TeamCode { get; set; }

        [MaxLength(500)]
        public string Description { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        // Team Leadership
        public int? ArchitectId { get; set; }
        public Employee? Architect { get; set; }

        public int? ProjectManagerId { get; set; }
        public Employee? ProjectManager { get; set; }

        public int? TeamLeadId { get; set; }
        public Employee? TeamLead { get; set; }

        // Users in this team
        public ICollection<UserTeam> UserTeams { get; set; } = new List<UserTeam>();
    }
}
