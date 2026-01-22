using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using ControlApp.API.Services;
using ControlApp.API.DTOs;
using ControlApp.API.Hubs;
using System.Security.Claims;

namespace ControlApp.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DefectsController : ControllerBase
    {
        private readonly IDefectService _defectService;
        private readonly IEmployeeService _employeeService;
        private readonly IHubContext<NotificationHub> _hubContext;

        public DefectsController(
            IDefectService defectService, 
            IEmployeeService employeeService,
            IHubContext<NotificationHub> hubContext)
        {
            _defectService = defectService;
            _employeeService = employeeService;
            _hubContext = hubContext;
        }

        // GET: api/defects?teamId=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DefectDto>>> GetAll([FromQuery] int teamId)
        {
            var defects = await _defectService.GetByTeamIdAsync(teamId);
            return Ok(defects);
        }

        // GET: api/defects/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DefectDto>> GetById(int id)
        {
            var defect = await _defectService.GetByIdAsync(id);
            if (defect == null)
                return NotFound();

            return Ok(defect);
        }

        // GET: api/defects/control/5
        [HttpGet("control/{controlId}")]
        public async Task<ActionResult<IEnumerable<DefectDto>>> GetByControlId(int controlId)
        {
            var defects = await _defectService.GetByControlIdAsync(controlId);
            return Ok(defects);
        }

        // GET: api/defects/status/Open?teamId=1
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<DefectDto>>> GetByStatus(string status, [FromQuery] int teamId)
        {
            var defects = await _defectService.GetByStatusAsync(status, teamId);
            return Ok(defects);
        }

        // GET: api/defects/severity/Critical?teamId=1
        [HttpGet("severity/{severity}")]
        public async Task<ActionResult<IEnumerable<DefectDto>>> GetBySeverity(string severity, [FromQuery] int teamId)
        {
            var defects = await _defectService.GetBySeverityAsync(severity, teamId);
            return Ok(defects);
        }

        // GET: api/defects/assigned/5
        [HttpGet("assigned/{employeeId}")]
        public async Task<ActionResult<IEnumerable<DefectDto>>> GetByAssignedTo(int employeeId)
        {
            var defects = await _defectService.GetByAssignedToAsync(employeeId);
            return Ok(defects);
        }

        // GET: api/defects/reported/5
        [HttpGet("reported/{employeeId}")]
        public async Task<ActionResult<IEnumerable<DefectDto>>> GetByReportedBy(int employeeId)
        {
            var defects = await _defectService.GetByReportedByAsync(employeeId);
            return Ok(defects);
        }

        // POST: api/defects
        [HttpPost]
        public async Task<ActionResult<DefectDto>> Create([FromBody] CreateDefectDto createDto, [FromQuery] int teamId)
        {
            try
            {
                Console.WriteLine($"=== CREATE DEFECT REQUEST ===");
                Console.WriteLine($"ControlId: {createDto.ControlId}");
                Console.WriteLine($"Title: {createDto.Title}");
                Console.WriteLine($"TeamId: {teamId}");
                
                // Get current user's ID from claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    Console.WriteLine("ERROR: No user ID in claims");
                    return Unauthorized();
                }

                var userId = int.Parse(userIdClaim);
                Console.WriteLine($"UserId from claims: {userId}");
                
                // Get employee associated with this user in the specified team
                var employees = await _employeeService.GetAllEmployeesAsync(teamId);
                Console.WriteLine($"Found {employees.Count()} employees for team {teamId}");
                
                var employee = employees.FirstOrDefault(e => e.UserId == userId);
                
                if (employee == null)
                {
                    Console.WriteLine($"ERROR: No employee found for userId {userId} in team {teamId}");
                    return BadRequest($"No employee record found for current user (ID: {userId}) in team {teamId}");
                }
                
                Console.WriteLine($"Found employee: {employee.EmployeeName} (ID: {employee.Id})");
                
                var defect = await _defectService.CreateAsync(createDto, employee.Id, teamId);
                Console.WriteLine($"Defect created successfully with ID: {defect.DefectId}");
                
                // Send SignalR notification if defect is assigned to someone
                if (defect.AssignedToEmployeeId.HasValue && defect.AssignedToEmployeeId.Value > 0)
                {
                    try
                    {
                        // Get assigned employee to find their userId
                        var assignedEmployee = employees.FirstOrDefault(e => e.Id == defect.AssignedToEmployeeId.Value);
                        if (assignedEmployee != null && assignedEmployee.UserId.HasValue)
                        {
                            var assignedUserId = assignedEmployee.UserId.Value.ToString();
                            await _hubContext.Clients.User(assignedUserId).SendAsync(
                                "DefectAssigned", 
                                defect.Title, 
                                defect.DefectId
                            );
                            Console.WriteLine($"SignalR notification sent to user {assignedUserId} for defect {defect.DefectId}");
                        }
                    }
                    catch (Exception signalREx)
                    {
                        Console.WriteLine($"Error sending SignalR notification: {signalREx.Message}");
                        // Don't fail the request if SignalR fails
                    }
                }
                
                return CreatedAtAction(nameof(GetById), new { id = defect.DefectId }, defect);
            }
            catch (Exception ex)
            {
                // Log full exception details
                Console.WriteLine("=== EXCEPTION IN CREATE DEFECT ===");
                Console.WriteLine($"Message: {ex.Message}");
                Console.WriteLine($"Inner Exception: {ex.InnerException?.Message}");
                Console.WriteLine($"Stack Trace: {ex.StackTrace}");
                
                var innerMessage = ex.InnerException?.Message ?? "No inner exception";
                var fullMessage = $"Error: {ex.Message}. Inner: {innerMessage}";
                return BadRequest(fullMessage);
            }
        }

        // PUT: api/defects/5
        [HttpPut("{id}")]
        public async Task<ActionResult<DefectDto>> Update(int id, [FromBody] UpdateDefectDto updateDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                int? updatedByEmployeeId = null;
                if (!string.IsNullOrEmpty(userIdClaim))
                {
                    var userId = int.Parse(userIdClaim);
                    var oldDefectForEmp = await _defectService.GetByIdAsync(id);
                    if (oldDefectForEmp != null)
                    {
                        var employees = await _employeeService.GetAllEmployeesAsync(oldDefectForEmp.TeamId);
                        updatedByEmployeeId = employees.FirstOrDefault(e => e.UserId == userId)?.Id;
                    }
                }

                var oldDefect = await _defectService.GetByIdAsync(id);
                var defect = await _defectService.UpdateAsync(id, updateDto, updatedByEmployeeId);
                if (defect == null) return NotFound();

                var allEmployees = await _employeeService.GetAllEmployeesAsync(defect.TeamId);

                // Send SignalR notification if status changed to Fixed/Resolved
                if (oldDefect != null && 
                    oldDefect.Status != defect.Status && 
                    (defect.Status == "Fixed" || defect.Status == "Resolved" || 
                     defect.Status == "Deferred" || defect.Status == "Duplicate" || defect.Status == "Not a Defect"))
                {
                    try
                    {
                        // Notify the QA who reported the defect
                        if (defect.ReportedByEmployeeId.HasValue && defect.ReportedByEmployeeId.Value > 0)
                        {
                            var reportedByEmployee = allEmployees.FirstOrDefault(e => e.Id == defect.ReportedByEmployeeId.Value);
                            
                            if (reportedByEmployee != null && reportedByEmployee.UserId.HasValue)
                            {
                                var reportedByUserId = reportedByEmployee.UserId.Value.ToString();
                                await _hubContext.Clients.User(reportedByUserId).SendAsync(
                                    "DefectStatusChanged", 
                                    defect.Title, 
                                    defect.DefectId,
                                    defect.ControlId,
                                    defect.Status
                                );
                            }
                        }
                    }
                    catch (Exception signalREx)
                    {
                        Console.WriteLine($"Error sending SignalR notification for status change: {signalREx.Message}");
                    }
                }

                // Notify assigned developer on ANY status change
                if (oldDefect != null && oldDefect.Status != defect.Status &&
                    defect.AssignedToEmployeeId.HasValue && defect.AssignedToEmployeeId.Value > 0)
                {
                    try
                    {
                        var assignedEmployee = allEmployees.FirstOrDefault(e => e.Id == defect.AssignedToEmployeeId.Value);
                        if (assignedEmployee != null && assignedEmployee.UserId.HasValue)
                        {
                            var assignedUserId = assignedEmployee.UserId.Value.ToString();
                            await _hubContext.Clients.User(assignedUserId).SendAsync(
                                "DefectStatusChanged",
                                defect.Title,
                                defect.DefectId,
                                defect.ControlId,
                                defect.Status
                            );
                        }
                    }
                    catch (Exception signalREx)
                    {
                        Console.WriteLine($"Error sending developer status notification: {signalREx.Message}");
                    }
                }

                // Notify QA reporter on ANY status change from developer
                if (oldDefect != null && oldDefect.Status != defect.Status &&
                    defect.ReportedByEmployeeId.HasValue && defect.ReportedByEmployeeId.Value > 0)
                {
                    try
                    {
                        var reportedByEmployee = allEmployees.FirstOrDefault(e => e.Id == defect.ReportedByEmployeeId.Value);
                        if (reportedByEmployee != null && reportedByEmployee.UserId.HasValue)
                        {
                            var reportedByUserId = reportedByEmployee.UserId.Value.ToString();
                            await _hubContext.Clients.User(reportedByUserId).SendAsync(
                                "DefectStatusChanged",
                                defect.Title,
                                defect.DefectId,
                                defect.ControlId,
                                defect.Status
                            );
                        }
                    }
                    catch (Exception signalREx)
                    {
                        Console.WriteLine($"Error sending QA status notification: {signalREx.Message}");
                    }
                }

                if (oldDefect != null && 
                    oldDefect.AssignedToEmployeeId != defect.AssignedToEmployeeId &&
                    defect.AssignedToEmployeeId.HasValue && 
                    defect.AssignedToEmployeeId.Value > 0)
                {
                    try
                    {
                        var assignedEmployee = allEmployees.FirstOrDefault(e => e.Id == defect.AssignedToEmployeeId.Value);
                        if (assignedEmployee != null && assignedEmployee.UserId.HasValue)
                        {
                            var assignedUserId = assignedEmployee.UserId.Value.ToString();
                            await _hubContext.Clients.User(assignedUserId).SendAsync(
                                "DefectAssigned", 
                                defect.Title, 
                                defect.DefectId
                            );
                        }
                    }
                    catch (Exception signalREx)
                    {
                        Console.WriteLine($"Error sending SignalR notification: {signalREx.Message}");
                    }
                }

                return Ok(defect);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/defects/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _defectService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }

        // GET: api/defects/activity/control/5
        [HttpGet("activity/control/{controlId}")]
        public async Task<ActionResult<IEnumerable<ActivityLogDto>>> GetActivityLogs(int controlId)
        {
            var logs = await _defectService.GetActivityLogsAsync(controlId);
            return Ok(logs);
        }
    }
}
