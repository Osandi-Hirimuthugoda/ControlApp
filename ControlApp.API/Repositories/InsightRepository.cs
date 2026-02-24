using Microsoft.EntityFrameworkCore;
using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public class InsightRepository : Repository<Insight>, IInsightRepository
    {
        public InsightRepository(AppDbContext context) : base(context)
        {
        }

        public async Task<IEnumerable<Insight>> GetActiveInsightsAsync()
        {
            return await _context.Set<Insight>()
                .Where(i => i.IsActive)
                .Include(i => i.Author)
                .Include(i => i.UpdatedBy)
                .Include(i => i.RelatedControl)
                .OrderByDescending(i => i.IsPinned)
                .ThenByDescending(i => i.Priority)
                .ThenByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Insight>> GetInsightsByCategoryAsync(string category)
        {
            return await _context.Set<Insight>()
                .Where(i => i.IsActive && i.Category == category)
                .Include(i => i.Author)
                .Include(i => i.UpdatedBy)
                .Include(i => i.RelatedControl)
                .OrderByDescending(i => i.IsPinned)
                .ThenByDescending(i => i.Priority)
                .ThenByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Insight>> GetInsightsByAuthorAsync(int authorId)
        {
            return await _context.Set<Insight>()
                .Where(i => i.AuthorId == authorId)
                .Include(i => i.Author)
                .Include(i => i.UpdatedBy)
                .Include(i => i.RelatedControl)
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Insight>> GetPinnedInsightsAsync()
        {
            return await _context.Set<Insight>()
                .Where(i => i.IsActive && i.IsPinned)
                .Include(i => i.Author)
                .Include(i => i.UpdatedBy)
                .Include(i => i.RelatedControl)
                .OrderByDescending(i => i.Priority)
                .ThenByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Insight>> GetInsightsByPriorityAsync(int priority)
        {
            return await _context.Set<Insight>()
                .Where(i => i.IsActive && i.Priority == priority)
                .Include(i => i.Author)
                .Include(i => i.UpdatedBy)
                .Include(i => i.RelatedControl)
                .OrderByDescending(i => i.IsPinned)
                .ThenByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Insight>> SearchInsightsAsync(string searchTerm)
        {
            var term = searchTerm.ToLower();
            return await _context.Set<Insight>()
                .Where(i => i.IsActive && 
                    (i.Title.ToLower().Contains(term) || 
                     i.Content.ToLower().Contains(term) ||
                     (i.Tags != null && i.Tags.ToLower().Contains(term)) ||
                     (i.Category != null && i.Category.ToLower().Contains(term))))
                .Include(i => i.Author)
                .Include(i => i.UpdatedBy)
                .Include(i => i.RelatedControl)
                .OrderByDescending(i => i.IsPinned)
                .ThenByDescending(i => i.Priority)
                .ThenByDescending(i => i.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<Insight>> GetRecentInsightsAsync(int count = 10)
        {
            return await _context.Set<Insight>()
                .Where(i => i.IsActive)
                .Include(i => i.Author)
                .Include(i => i.UpdatedBy)
                .Include(i => i.RelatedControl)
                .OrderByDescending(i => i.CreatedAt)
                .Take(count)
                .ToListAsync();
        }

        public async Task<IEnumerable<string>> GetCategoriesAsync()
        {
            return await _context.Set<Insight>()
                .Where(i => i.IsActive && !string.IsNullOrEmpty(i.Category))
                .Select(i => i.Category!)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();
        }

        public async Task<Insight?> GetInsightWithDetailsAsync(int insightId)
        {
            return await _context.Set<Insight>()
                .Include(i => i.Author)
                .Include(i => i.UpdatedBy)
                .Include(i => i.RelatedControl)
                .FirstOrDefaultAsync(i => i.InsightId == insightId);
        }
    }
}