using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;
using Microsoft.EntityFrameworkCore;

namespace ControlApp.API.Services
{
    public class TestCaseService : ITestCaseService
    {
        private readonly ITestCaseRepository _testCaseRepository;
        private readonly IEmployeeRepository _employeeRepository;
        private readonly IControlRepository _controlRepository;
        private readonly AppDbContext _context;

        public TestCaseService(
            ITestCaseRepository testCaseRepository,
            IEmployeeRepository employeeRepository,
            IControlRepository controlRepository,
            AppDbContext context)
        {
            _testCaseRepository = testCaseRepository;
            _employeeRepository = employeeRepository;
            _controlRepository = controlRepository;
            _context = context;
        }

        public async Task<IEnumerable<TestCaseDto>> GetAllAsync()
        {
            var testCases = await _testCaseRepository.GetAllAsync();
            return testCases.Select(MapToDto);
        }

        public async Task<TestCaseDto?> GetByIdAsync(int id)
        {
            var testCase = await _testCaseRepository.GetByIdAsync(id);
            return testCase != null ? MapToDto(testCase) : null;
        }

        public async Task<IEnumerable<TestCaseDto>> GetByControlIdAsync(int controlId)
        {
            var testCases = await _testCaseRepository.GetByControlIdAsync(controlId);
            return testCases.Select(MapToDto);
        }

        public async Task<IEnumerable<TestCaseDto>> GetByTeamIdAsync(int teamId)
        {
            try
            {
                var testCases = await _testCaseRepository.GetByTeamIdAsync(teamId);
                return testCases.Select(MapToDto);
            }
            catch (Exception ex)
            {
                // Log the error and return empty list instead of throwing
                Console.WriteLine($"Error in GetByTeamIdAsync: {ex.Message}");
                return new List<TestCaseDto>();
            }
        }

        public async Task<IEnumerable<TestCaseDto>> GetByStatusAsync(string status, int teamId)
        {
            var testCases = await _testCaseRepository.GetByStatusAsync(status, teamId);
            return testCases.Select(MapToDto);
        }

        public async Task<IEnumerable<TestCaseDto>> GetByTesterAsync(int employeeId)
        {
            var testCases = await _testCaseRepository.GetByTesterAsync(employeeId);
            return testCases.Select(MapToDto);
        }

        public async Task<TestCaseDto> CreateAsync(CreateTestCaseDto createDto, int userId, int teamId)
        {
            // Get employee by userId
            var employees = await _employeeRepository.GetAllAsync();
            var employee = employees.FirstOrDefault(e => e.UserId == userId);

            // If teamId not provided, derive it from the control
            if (teamId == 0)
            {
                var control = await _controlRepository.GetByIdAsync(createDto.ControlId);
                if (control != null && control.TeamId.HasValue) teamId = control.TeamId.Value;
            }

            var testCase = new TestCase
            {
                ControlId = createDto.ControlId,
                SubDescriptionIndex = createDto.SubDescriptionIndex,
                TestCaseTitle = createDto.TestCaseTitle,
                TestSteps = createDto.TestSteps,
                ExpectedResult = createDto.ExpectedResult,
                Status = "Not Tested",
                Priority = createDto.Priority,
                TestType = createDto.TestType,
                TeamId = teamId,
                CreatedDate = DateTime.UtcNow,
                TestedByEmployeeId = employee?.Id
            };

            var created = await _testCaseRepository.AddAsync(testCase);

            // Log activity
            await LogActivityAsync("TestCase", created.TestCaseId, createDto.ControlId, "Created",
                null, "Not Tested", $"Test case '{createDto.TestCaseTitle}' created",
                employee?.Id, employee?.EmployeeName, teamId);

            var result = await _testCaseRepository.GetByIdAsync(created.TestCaseId);
            return MapToDto(result!);
        }

        public async Task<TestCaseDto?> UpdateAsync(int id, UpdateTestCaseDto updateDto, int userId)
        {
            var testCase = await _testCaseRepository.GetByIdAsync(id);
            if (testCase == null) return null;

            var oldStatus = testCase.Status;

            // Get employee by userId
            var employees = await _employeeRepository.GetAllAsync();
            var employee = employees.FirstOrDefault(e => e.UserId == userId);

            if (!string.IsNullOrEmpty(updateDto.TestCaseTitle))
                testCase.TestCaseTitle = updateDto.TestCaseTitle;

            if (updateDto.TestSteps != null)
                testCase.TestSteps = updateDto.TestSteps;

            if (updateDto.ExpectedResult != null)
                testCase.ExpectedResult = updateDto.ExpectedResult;

            if (!string.IsNullOrEmpty(updateDto.Status))
            {
                testCase.Status = updateDto.Status;
                testCase.TestedDate = DateTime.UtcNow;
                testCase.TestedByEmployeeId = employee?.Id;
            }

            if (updateDto.ActualResult != null)
                testCase.ActualResult = updateDto.ActualResult;

            if (!string.IsNullOrEmpty(updateDto.Priority))
                testCase.Priority = updateDto.Priority;

            if (!string.IsNullOrEmpty(updateDto.TestType))
                testCase.TestType = updateDto.TestType;

            if (updateDto.DefectId.HasValue)
                testCase.DefectId = updateDto.DefectId.Value;

            var updated = await _testCaseRepository.UpdateAsync(testCase);

            // Log status change
            if (!string.IsNullOrEmpty(updateDto.Status) && oldStatus != updateDto.Status)
            {
                await LogActivityAsync("TestCase", id, testCase.ControlId, "StatusChanged",
                    oldStatus, updateDto.Status,
                    $"Test case status changed from '{oldStatus}' to '{updateDto.Status}'",
                    employee?.Id, employee?.EmployeeName, testCase.TeamId);
            }

            var result = await _testCaseRepository.GetByIdAsync(updated.TestCaseId);
            return MapToDto(result!);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await _testCaseRepository.DeleteAsync(id);
        }

        private async Task LogActivityAsync(string entityType, int entityId, int controlId,
            string action, string? oldValue, string? newValue, string? description,
            int? employeeId, string? employeeName, int teamId)
        {
            var log = new ActivityLog
            {
                EntityType = entityType,
                EntityId = entityId,
                ControlId = controlId,
                Action = action,
                OldValue = oldValue,
                NewValue = newValue,
                Description = description,
                PerformedByEmployeeId = employeeId,
                PerformedByName = employeeName,
                Timestamp = DateTime.UtcNow,
                TeamId = teamId
            };
            _context.ActivityLogs.Add(log);
            await _context.SaveChangesAsync();
        }

        private TestCaseDto MapToDto(TestCase testCase)
        {
            return new TestCaseDto
            {
                TestCaseId = testCase.TestCaseId,
                ControlId = testCase.ControlId,
                SubDescriptionIndex = testCase.SubDescriptionIndex,
                ControlName = testCase.Control?.Description,
                TestCaseTitle = testCase.TestCaseTitle,
                TestSteps = testCase.TestSteps,
                ExpectedResult = testCase.ExpectedResult,
                Status = testCase.Status,
                ActualResult = testCase.ActualResult,
                Priority = testCase.Priority,
                TestType = testCase.TestType,
                TestedByEmployeeId = testCase.TestedByEmployeeId,
                TestedByName = testCase.TestedBy?.EmployeeName,
                TestedDate = testCase.TestedDate,
                DefectId = testCase.DefectId,
                TeamId = testCase.TeamId,
                TeamName = testCase.Team?.TeamName,
                CreatedDate = testCase.CreatedDate
            };
        }
    }
}
