namespace ControlApp.API.DTOs
{
    public class TeamStatsDto
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string TeamCode { get; set; } = string.Empty;
        public int TotalControls { get; set; }
        public int CompletedControls { get; set; }
        public int InProgressControls { get; set; }
        public int NotStartedControls { get; set; }
        public int TotalEmployees { get; set; }
        public int TotalControlTypes { get; set; }
        public double CompletionPercentage { get; set; }
    }

    public class DashboardStatsDto
    {
        public List<TeamStatsDto> TeamStats { get; set; } = new List<TeamStatsDto>();
        public int TotalTeams { get; set; }
        public int TotalControls { get; set; }
        public int TotalEmployees { get; set; }
        public double OverallCompletionPercentage { get; set; }
    }
}
