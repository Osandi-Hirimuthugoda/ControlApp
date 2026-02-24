using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public interface IInsightRepository : IRepository<Insight>
    {
        Task<IEnumerable<Insight>> GetActiveInsightsAsync();
        Task<IEnumerable<Insight>> GetInsightsByCategoryAsync(string category);
        Task<IEnumerable<Insight>> GetInsightsByAuthorAsync(int authorId);
        Task<IEnumerable<Insight>> GetPinnedInsightsAsync();
        Task<IEnumerable<Insight>> GetInsightsByPriorityAsync(int priority);
        Task<IEnumerable<Insight>> SearchInsightsAsync(string searchTerm);
        Task<IEnumerable<Insight>> GetRecentInsightsAsync(int count = 10);
        Task<IEnumerable<string>> GetCategoriesAsync();
        Task<Insight?> GetInsightWithDetailsAsync(int insightId);
    }
}