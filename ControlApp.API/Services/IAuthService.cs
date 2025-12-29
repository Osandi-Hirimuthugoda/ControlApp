using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface IAuthService
    {
        Task<AuthResponseDto?> LoginAsync(LoginDto loginDto);
        Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto);
        Task<bool> UserExistsAsync(string username, string email);
    }
}






