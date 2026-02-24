using System;

namespace ControlApp.API.DTOs
{
    public class TeamDto
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; }
        public string TeamCode { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Team Leadership
        public int? ArchitectId { get; set; }
        public string? ArchitectName { get; set; }
        
        public int? ProjectManagerId { get; set; }
        public string? ProjectManagerName { get; set; }
        
        public int? TeamLeadId { get; set; }
        public string? TeamLeadName { get; set; }
    }

    public class CreateTeamDto
    {
        public string TeamName { get; set; }
        public string TeamCode { get; set; }
        public string Description { get; set; }
        public int? ArchitectId { get; set; }
        public int? ProjectManagerId { get; set; }
        public int? TeamLeadId { get; set; }
    }

    public class UpdateTeamDto
    {
        public string TeamName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public int? ArchitectId { get; set; }
        public int? ProjectManagerId { get; set; }
        public int? TeamLeadId { get; set; }
    }
}
