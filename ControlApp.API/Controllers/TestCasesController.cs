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
    public class TestCasesController : ControllerBase
    {
        private readonly ITestCaseService _testCaseService;
        private readonly IEmployeeService _employeeService;
        private readonly IHubContext<NotificationHub> _hubContext;

        public TestCasesController(
            ITestCaseService testCaseService,
            IEmployeeService employeeService,
            IHubContext<NotificationHub> hubContext)
        {
            _testCaseService = testCaseService;
            _employeeService = employeeService;
            _hubContext = hubContext;
        }

        // GET: api/testcases?teamId=1
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TestCaseDto>>> GetAll([FromQuery] int teamId)
        {
            var testCases = await _testCaseService.GetByTeamIdAsync(teamId);
            return Ok(testCases);
        }

        // GET: api/testcases/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TestCaseDto>> GetById(int id)
        {
            var testCase = await _testCaseService.GetByIdAsync(id);
            if (testCase == null)
                return NotFound();

            return Ok(testCase);
        }

        // GET: api/testcases/control/5
        [HttpGet("control/{controlId}")]
        public async Task<ActionResult<IEnumerable<TestCaseDto>>> GetByControlId(int controlId)
        {
            var testCases = await _testCaseService.GetByControlIdAsync(controlId);
            return Ok(testCases);
        }

        // GET: api/testcases/status/Pass?teamId=1
        [HttpGet("status/{status}")]
        public async Task<ActionResult<IEnumerable<TestCaseDto>>> GetByStatus(string status, [FromQuery] int teamId)
        {
            var testCases = await _testCaseService.GetByStatusAsync(status, teamId);
            return Ok(testCases);
        }

        // POST: api/testcases
        [HttpPost]
        public async Task<ActionResult<TestCaseDto>> Create([FromBody] CreateTestCaseDto createDto, [FromQuery] int teamId)
        {
            try
            {
                // Get current user's employee ID from claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized();

                var userId = int.Parse(userIdClaim);
                
                var testCase = await _testCaseService.CreateAsync(createDto, userId, teamId);
                return CreatedAtAction(nameof(GetById), new { id = testCase.TestCaseId }, testCase);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // PUT: api/testcases/5
        [HttpPut("{id}")]
        public async Task<ActionResult<TestCaseDto>> Update(int id, [FromBody] UpdateTestCaseDto updateDto)
        {
            try
            {
                // Get current user's employee ID from claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                    return Unauthorized();

                var userId = int.Parse(userIdClaim);
                
                // Get the old test case to check status change
                var oldTestCase = await _testCaseService.GetByIdAsync(id);
                
                var testCase = await _testCaseService.UpdateAsync(id, updateDto, userId);
                if (testCase == null)
                    return NotFound();

                // Send SignalR notification if test case status changed to "Fail"
                if (oldTestCase != null && 
                    oldTestCase.Status != "Fail" && 
                    testCase.Status == "Fail" &&
                    testCase.TestedByEmployeeId.HasValue && 
                    testCase.TestedByEmployeeId.Value > 0)
                {
                    try
                    {
                        var employees = await _employeeService.GetAllEmployeesAsync(testCase.TeamId);
                        var assignedEmployee = employees.FirstOrDefault(e => e.Id == testCase.TestedByEmployeeId.Value);
                        
                        if (assignedEmployee != null && assignedEmployee.UserId.HasValue)
                        {
                            var assignedUserId = assignedEmployee.UserId.Value.ToString();
                            await _hubContext.Clients.User(assignedUserId).SendAsync(
                                "TestCaseFailed", 
                                testCase.TestCaseTitle, 
                                testCase.TestCaseId
                            );
                            Console.WriteLine($"SignalR notification sent to user {assignedUserId} for failed test case {testCase.TestCaseId}");
                        }
                    }
                    catch (Exception signalREx)
                    {
                        Console.WriteLine($"Error sending SignalR notification: {signalREx.Message}");
                        // Don't fail the request if SignalR fails
                    }
                }

                return Ok(testCase);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/testcases/5
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var result = await _testCaseService.DeleteAsync(id);
            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}
