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
    }
}







