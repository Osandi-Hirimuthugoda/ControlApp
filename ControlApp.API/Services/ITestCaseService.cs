using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface ITestCaseService
    {
        Task<IEnumerable<TestCaseDto>> GetAllAsync();
        Task<TestCaseDto?> GetByIdAsync(int id);
        Task<IEnumerable<TestCaseDto>> GetByControlIdAsync(int controlId);
        Task<IEnumerable<TestCaseDto>> GetByTeamIdAsync(int teamId);
        Task<IEnumerable<TestCaseDto>> GetByStatusAsync(string status, int teamId);
        Task<IEnumerable<TestCaseDto>> GetByTesterAsync(int employeeId);
        Task<TestCaseDto> CreateAsync(CreateTestCaseDto createDto, int userId, int teamId);
        Task<TestCaseDto?> UpdateAsync(int id, UpdateTestCaseDto updateDto, int userId);
        Task<bool> DeleteAsync(int id);
    }
}
