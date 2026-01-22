using ControlApp.API.Data;
using ControlApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace ControlApp.API.Repositories
{
    public class TestCaseRepository : ITestCaseRepository
    {
        private readonly AppDbContext _context;

        public TestCaseRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<TestCase>> GetAllAsync()
        {
            return await _context.TestCases
                .Include(tc => tc.Control)
                .Include(tc => tc.TestedBy)
                .Include(tc => tc.Defect)
                .Include(tc => tc.Team)
                .ToListAsync();
        }

        public async Task<TestCase?> GetByIdAsync(int id)
        {
            return await _context.TestCases
                .Include(tc => tc.Control)
                .Include(tc => tc.TestedBy)
                .Include(tc => tc.Defect)
                .Include(tc => tc.Team)
                .FirstOrDefaultAsync(tc => tc.TestCaseId == id);
        }

        public async Task<IEnumerable<TestCase>> GetByControlIdAsync(int controlId)
        {
            return await _context.TestCases
                .Include(tc => tc.TestedBy)
                .Include(tc => tc.Defect)
                .Where(tc => tc.ControlId == controlId)
                .OrderBy(tc => tc.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<TestCase>> GetByTeamIdAsync(int teamId)
        {
            return await _context.TestCases
                .Include(tc => tc.Control)
                .Include(tc => tc.TestedBy)
                .Include(tc => tc.Defect)
                .Where(tc => tc.TeamId == teamId || 
                             (tc.TeamId == 0 && tc.Control != null && tc.Control.TeamId == teamId))
                .OrderByDescending(tc => tc.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<TestCase>> GetByStatusAsync(string status, int teamId)
        {
            return await _context.TestCases
                .Include(tc => tc.Control)
                .Include(tc => tc.TestedBy)
                .Include(tc => tc.Defect)
                .Where(tc => tc.Status == status && tc.TeamId == teamId)
                .OrderByDescending(tc => tc.CreatedDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<TestCase>> GetByTesterAsync(int employeeId)
        {
            return await _context.TestCases
                .Include(tc => tc.Control)
                .Include(tc => tc.Defect)
                .Where(tc => tc.TestedByEmployeeId == employeeId)
                .OrderByDescending(tc => tc.TestedDate)
                .ToListAsync();
        }

        public async Task<TestCase> AddAsync(TestCase testCase)
        {
            _context.TestCases.Add(testCase);
            await _context.SaveChangesAsync();
            return testCase;
        }

        public async Task<TestCase> UpdateAsync(TestCase testCase)
        {
            _context.TestCases.Update(testCase);
            await _context.SaveChangesAsync();
            return testCase;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var testCase = await _context.TestCases.FindAsync(id);
            if (testCase == null)
                return false;

            _context.TestCases.Remove(testCase);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
