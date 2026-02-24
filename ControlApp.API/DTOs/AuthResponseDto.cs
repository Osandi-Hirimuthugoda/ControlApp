namespace ControlApp.API.DTOs
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public int? CurrentTeamId { get; set; }
        public string? CurrentTeamName { get; set; }
        public bool IsSuperAdmin { get; set; }
        public List<UserTeamDto> Teams { get; set; } = new List<UserTeamDto>();
    }

    public class UserTeamDto
    {
        public int TeamId { get; set; }
        public string TeamName { get; set; } = string.Empty;
        public string TeamCode { get; set; } = string.Empty;
    }
}



