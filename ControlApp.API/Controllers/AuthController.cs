using Microsoft.AspNetCore.Mvc;
using ControlApp.API.DTOs;
using ControlApp.API.Services;

namespace ControlApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid) 
                {
                    return BadRequest(ModelState);
                }

                var result = await _authService.LoginAsync(loginDto);

                if (result == null)
                {
                    return Unauthorized(new { message = "Invalid username/email or password" });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto registerDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Check if user already exists
                if (await _authService.UserExistsAsync(registerDto.Username, registerDto.Email))
                {
                    return Conflict(new { message = "Username or email already exists" });
                }

                var result = await _authService.RegisterAsync(registerDto);

                if (result == null)
                {
                    return BadRequest(new { message = "Registration failed" });
                }

                return CreatedAtAction(nameof(Login), result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during registration");
                return StatusCode(500, new { message = "An error occurred during registration" });
            }
        }

        [HttpPost("validate")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public IActionResult ValidateToken()
        {
            // If we reach here, the token is valid (due to [Authorize] attribute)
            var username = User.Identity?.Name;
            var role = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.Role)?.Value;

            return Ok(new
            {
                message = "Token is valid",
                username = username,
                role = role
            });
        }

        [HttpPut("update-email")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> UpdateEmail([FromBody] UpdateEmailDto updateEmailDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var result = await _authService.UpdateEmailAsync(userId, updateEmailDto);
                
                if (!result)
                {
                    return BadRequest(new { message = "Failed to update email. Please check your current password." });
                }

                return Ok(new { message = "Email updated successfully" });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating email");
                return StatusCode(500, new { message = "An error occurred while updating email" });
            }
        }

        [HttpPut("update-password")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto updatePasswordDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var result = await _authService.UpdatePasswordAsync(userId, updatePasswordDto);
                
                if (!result)
                {
                    return BadRequest(new { message = "Failed to update password. Please check your current password." });
                }

                return Ok(new { message = "Password updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating password");
                return StatusCode(500, new { message = "An error occurred while updating password" });
            }
        }

        [HttpPut("update-phone")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public async Task<IActionResult> UpdatePhoneNumber([FromBody] UpdatePhoneNumberDto updatePhoneNumberDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized(new { message = "Invalid user token" });
                }

                var result = await _authService.UpdatePhoneNumberAsync(userId, updatePhoneNumberDto);
                
                if (!result)
                {
                    return BadRequest(new { message = "Failed to update phone number." });
                }

                return Ok(new { message = "Phone number updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating phone number");
                return StatusCode(500, new { message = "An error occurred while updating phone number" });
            }
        }
    }
}







