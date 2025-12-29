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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<EmployeeDto>>> GetAllEmployees()
        {
            try
            {
                var employees = await _employeeService.GetAllEmployeesAsync();
                return Ok(employees);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error loading employees: {ex.Message}. Inner exception: {ex.InnerException?.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<EmployeeDto>> GetEmployeeById(int id)
        {
            var employee = await _employeeService.GetEmployeeByIdAsync(id);
            if (employee == null)
                return NotFound($"Employee with ID {id} not found.");

            return Ok(employee);
        }

        
        [HttpPost]
        [Authorize(Roles = "Admin")]
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

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<EmployeeDto>> UpdateEmployee(int id, [FromBody] CreateEmployeeDto updateEmployeeDto)
        {
            var employee = await _employeeService.UpdateEmployeeAsync(id, updateEmployeeDto);
            if (employee == null)
                return NotFound($"Employee with ID {id} not found.");

            return Ok(employee);
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
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