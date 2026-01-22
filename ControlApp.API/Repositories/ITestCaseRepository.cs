using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public interface ITestCaseRepository
    {
        Task<IEnumerable<TestCase>> GetAllAsync();
        Task<TestCase?> GetByIdAsync(int id);
        Task<IEnumerable<TestCase>> GetByControlIdAsync(int controlId);
        Task<IEnumerable<TestCase>> GetByTeamIdAsync(int teamId);
        Task<IEnumerable<TestCase>> GetByStatusAsync(string status, int teamId);
        Task<IEnumerable<TestCase>> GetByTesterAsync(int employeeId);
        Task<TestCase> AddAsync(TestCase testCase);
        Task<TestCase> UpdateAsync(TestCase testCase);
        Task<bool> DeleteAsync(int id);
    }
}
