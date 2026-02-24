using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ControlApp.API.DTOs;
using ControlApp.API.Services;

namespace ControlApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeesController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        // GET: api/employees
        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAllEmployees([FromQuery] int? teamId = null)
        {
            try
            {
                // IMPORTANT: If teamId is explicitly provided in query parameter, use it
                // This allows team switching without requiring JWT token refresh
                // Only use JWT claims if teamId is NOT provided
                if (!teamId.HasValue)
                {
                    var isSuperAdmin = User.Claims.FirstOrDefault(c => c.Type == "IsSuperAdmin")?.Value == "True";
                    var userTeamIdClaim = User.Claims.FirstOrDefault(c => c.Type == "TeamId")?.Value;
                    
                    // If teamId is not provided and user is not Super Admin, use user's team from JWT
                    if (!isSuperAdmin && int.TryParse(userTeamIdClaim, out int userTeamId))
                    {
                        teamId = userTeamId;
                    }
                }
                
                // Pass teamId to service - repository will use it if provided, otherwise use JWT claims
                var employees = await _employeeService.GetAllEmployeesAsync(teamId);
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error loading employees: {ex.Message}. Inner exception: {ex.InnerException?.Message}");
            }
        }

        // GET: api/employees/{id}
        [HttpGet("{id:int}")]
        public async Task<ActionResult<EmployeeDto>> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null)
                return NotFound($"Employee with ID {id} not found.");

            return Ok(employee);
        }

        // POST: api/employees/register
        [HttpPost("register")]
        // Allow both Admin and Project Manager to register employees
        [Authorize(Roles = "Admin,Project Manager")]
        public async Task<ActionResult<EmployeeDto>> RegisterEmployee([FromBody] RegisterEmployeeWithUserDto registerDto)
        {
            try
            {
                if (registerDto == null)
                    return BadRequest(new { message = "Employee registration data is required." });

                if (string.IsNullOrWhiteSpace(registerDto.EmployeeName))
                    return BadRequest(new { message = "Employee name is required." });

                if (string.IsNullOrWhiteSpace(registerDto.Email))
                    return BadRequest(new { message = "Email is required." });

                if (string.IsNullOrWhiteSpace(registerDto.Password))
                    return BadRequest(new { message = "Password is required." });

                var employee = await _employeeService.RegisterEmployeeWithUserAsync(registerDto);
                
                return CreatedAtAction(nameof(GetEmployeeById), new { id = employee.Id }, employee);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error registering employee: {ex.Message}" });
            }
        }

        // POST: api/employees
        [HttpPost]
        // Only Admin and Project Manager can create employees (non-registered flow)
        [Authorize(Roles = "Admin,Project Manager")]
        public async Task<ActionResult<EmployeeDto>> CreateEmployee([FromBody] CreateEmployeeWithControlDto createDto)
        {
            try
            {
                if (createDto == null)
                    return BadRequest(new { message = "Employee data is required." });

                if (string.IsNullOrWhiteSpace(createDto.EmployeeName))
                    return BadRequest(new { message = "Employee name is required." });

                var employee = await _employeeService.CreateEmployeeWithControlAsync(createDto);
                
                return CreatedAtAction(nameof(GetEmployeeById), new { id = employee.Id }, employee);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Error creating employee: {ex.Message}" });
            }
        }

        // PUT: api/employees/{id}
        [HttpPut("{id:int}")]
        // Admin, Software Architecture, and Team Lead can update employees
        [Authorize(Roles = "Admin,Software Architecture,Team Lead")]
        public async Task<ActionResult<EmployeeDto>> UpdateEmployee(int id, [FromBody] CreateEmployeeDto updateEmployeeDto)
        {
            var employee = await _employeeService.UpdateEmployeeAsync(id, updateEmployeeDto);
            if (employee == null)
                return NotFound($"Employee with ID {id} not found.");

            return Ok(employee);
        }

        // DELETE: api/employees/{id}
        [HttpDelete("{id:int}")]
        // Admin, Software Architecture, and Team Lead can delete employees
        [Authorize(Roles = "Admin,Software Architecture,Team Lead")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            try
            {
                var deleted = await _employeeService.DeleteEmployeeAsync(id);
                if (!deleted)
                    return NotFound(new { message = $"Employee with ID {id} not found." });

                return NoContent();
            }
            catch (Exception ex)
            {
                // Log the full exception details for debugging
                var errorMessage = $"Error deleting employee: {ex.Message}";
                if (ex.InnerException != null)
                {
                    errorMessage += $" Inner exception: {ex.InnerException.Message}";
                }
                
                return StatusCode(500, new { 
                    message = errorMessage,
                    error = ex.GetType().Name
                });
            }
        }
    }
}