using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
        Task<bool> UserExistsAsync(string username, string email);
        Task<bool> UpdateEmailAsync(int userId, UpdateEmailDto updateEmailDto);
        Task<bool> UpdatePasswordAsync(int userId, UpdatePasswordDto updatePasswordDto);
        Task<bool> UpdatePhoneNumberAsync(int userId, UpdatePhoneNumberDto updatePhoneNumberDto);
        Task<bool> SwitchTeamAsync(int userId, int teamId);
    }
}






