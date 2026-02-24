using ControlApp.API.DTOs;

namespace ControlApp.API.Services
{
    public interface IInsightService
    {
        Task<InsightDto> CreateInsightAsync(CreateInsightDto createInsightDto);
        Task<InsightDto?> GetInsightByIdAsync(int insightId);
        Task<IEnumerable<InsightDto>> GetAllInsightsAsync();
        Task<IEnumerable<InsightDto>> GetActiveInsightsAsync();
        Task<InsightDto?> UpdateInsightAsync(int insightId, UpdateInsightDto updateInsightDto);
        Task<bool> DeleteInsightAsync(int insightId);
        Task<bool> ToggleInsightActiveAsync(int insightId);
        Task<bool> ToggleInsightPinnedAsync(int insightId);
        Task<IEnumerable<InsightDto>> GetInsightsByCategoryAsync(string category);
        Task<IEnumerable<InsightDto>> GetInsightsByAuthorAsync(int authorId);
        Task<IEnumerable<InsightDto>> GetPinnedInsightsAsync();
        Task<IEnumerable<InsightDto>> SearchInsightsAsync(string searchTerm);
        Task<InsightSummaryDto> GetInsightSummaryAsync();
        Task<IEnumerable<string>> GetCategoriesAsync();
    }
}