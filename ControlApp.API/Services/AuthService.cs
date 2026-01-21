using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ControlApp.API.DTOs;
using ControlApp.API.Models;
using BCrypt.Net;

namespace ControlApp.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthService> _logger;

        public AuthService(AppDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<AuthResponseDto?> LoginAsync(LoginDto loginDto)
        {
            try
            {
                // Find user by username or email
                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Username == loginDto.UsernameOrEmail ||
                                              u.Email == loginDto.UsernameOrEmail);

                if (user == null)
                {
                    _logger.LogWarning("Login attempt with invalid username/email: {UsernameOrEmail}", loginDto.UsernameOrEmail);
                    return null;
                }

                // Verify password
                if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
                {
                    
                    _logger.LogWarning("Invalid password attempt for user: {Username}", user.Username);
                    return null;
                }

                // Update last login
                user.LastLoginAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                // Generate JWT token
                var token = GenerateJwtToken(user);

                return new AuthResponseDto
                {
                    Token = token,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role,
                    ExpiresAt = DateTime.UtcNow.AddHours(24) // Token expires in 24 hours
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login for user: {UsernameOrEmail}", loginDto.UsernameOrEmail);
                throw;
            }
        }

        public async Task<AuthResponseDto?> RegisterAsync(RegisterDto registerDto)
        {
            try
            {
                // Check if user already exists
                if (await UserExistsAsync(registerDto.Username, registerDto.Email))
                {
                    _logger.LogWarning("Registration attempt with existing username or email: {Username}, {Email}",
                        registerDto.Username, registerDto.Email);
                    return null;
                }

                // Hash password
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password);

                // Create new user
                var user = new User
                {
                    Username = registerDto.Username,
                    Email = registerDto.Email,
                    PasswordHash = passwordHash,
                    FullName = registerDto.FullName,
                    Role = registerDto.Role ?? "Employee", // Use provided role or default to Employee
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                _logger.LogInformation("New user registered: {Username}", user.Username);

                // Generate JWT token
                var token = GenerateJwtToken(user);

                return new AuthResponseDto
                {
                    Token = token,
                    Username = user.Username,
                    Email = user.Email,
                    Role = user.Role,
                    ExpiresAt = DateTime.UtcNow.AddHours(24)
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration for user: {Username}", registerDto.Username);
                throw;
            }
        }

        public async Task<bool> UserExistsAsync(string username, string email)
        {
            return await _context.Users
                .AnyAsync(u => u.Username == username || u.Email == email);
        }

        public async Task<bool> UpdateEmailAsync(int userId, UpdateEmailDto updateEmailDto)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return false;
                }

                // Verify current password
                if (!BCrypt.Net.BCrypt.Verify(updateEmailDto.CurrentPassword, user.PasswordHash))
                {
                    return false;
                }

                // Check if new email already exists
                var emailExists = await _context.Users
                    .AnyAsync(u => u.Email == updateEmailDto.NewEmail && u.Id != userId);
                
                if (emailExists)
                {
                    throw new ArgumentException("Email already exists. Please use a different email.");
                }

                // Update email and username (username is same as email)
                user.Email = updateEmailDto.NewEmail.Trim().ToLower();
                user.Username = updateEmailDto.NewEmail.Trim().ToLower();
                
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("User {UserId} updated email to {NewEmail}", userId, updateEmailDto.NewEmail);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating email for user {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> UpdatePasswordAsync(int userId, UpdatePasswordDto updatePasswordDto)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return false;
                }

                // Verify current password
                if (!BCrypt.Net.BCrypt.Verify(updatePasswordDto.CurrentPassword, user.PasswordHash))
                {
                    return false;
                }

                // Hash new password
                var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(updatePasswordDto.NewPassword);
                user.PasswordHash = newPasswordHash;
                
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("User {UserId} updated password", userId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating password for user {UserId}", userId);
                throw;
            }
        }

        public async Task<bool> UpdatePhoneNumberAsync(int userId, UpdatePhoneNumberDto updatePhoneNumberDto)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null)
                {
                    return false;
                }

                // Update phone number
                user.PhoneNumber = updatePhoneNumberDto.PhoneNumber.Trim();
                
                await _context.SaveChangesAsync();
                
                _logger.LogInformation("User {UserId} updated phone number", userId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating phone number for user {UserId}", userId);
                throw;
            }
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatShouldBeAtLeast32CharactersLong!";
            var issuer = jwtSettings["Issuer"] ?? "ControlAppAPI";
            var audience = jwtSettings["Audience"] ?? "ControlAppClient";
            var expirationHours = int.Parse(jwtSettings["ExpirationHours"] ?? "24");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expirationHours),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}





