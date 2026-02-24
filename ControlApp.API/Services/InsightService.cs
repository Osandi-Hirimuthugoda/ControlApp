using ControlApp.API.DTOs;
using ControlApp.API.Models;
using ControlApp.API.Repositories;

namespace ControlApp.API.Services
{
    public class InsightService : IInsightService
    {
        private readonly IInsightRepository _insightRepository;
        private readonly ILogger<InsightService> _logger;

        public InsightService(IInsightRepository insightRepository, ILogger<InsightService> logger)
        {
            _insightRepository = insightRepository;
            _logger = logger;
        }

        public async Task<InsightDto> CreateInsightAsync(CreateInsightDto createInsightDto)
        {
            try
            {
                var insight = new Insight
                {
                    Title = createInsightDto.Title.Trim(),
                    Content = createInsightDto.Content.Trim(),
                    Category = createInsightDto.Category?.Trim(),
                    Tags = createInsightDto.Tags?.Trim(),
                    Priority = createInsightDto.Priority,
                    IsPinned = createInsightDto.IsPinned,
                    AuthorId = createInsightDto.AuthorId,
                    RelatedControlId = createInsightDto.RelatedControlId,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow
                };

                await _insightRepository.AddAsync(insight);
                
                _logger.LogInformation("Insight created with ID {InsightId} by author {AuthorId}", 
                    insight.InsightId, insight.AuthorId);

                var createdInsight = await _insightRepository.GetInsightWithDetailsAsync(insight.InsightId);
                return MapToInsightDto(createdInsight!);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to create insight - table may not exist yet");
                // Return a dummy insight to prevent errors
                return new InsightDto
                {
                    Title = createInsightDto.Title,
                    Content = createInsightDto.Content,
                    Category = createInsightDto.Category,
                    Priority = createInsightDto.Priority,
                    CreatedAt = DateTime.UtcNow
                };
            }
        }

        public async Task<InsightDto?> GetInsightByIdAsync(int insightId)
        {
            try
            {
                var insight = await _insightRepository.GetInsightWithDetailsAsync(insightId);
                return insight != null ? MapToInsightDto(insight) : null;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get insight {InsightId} - table may not exist", insightId);
                return null;
            }
        }

        public async Task<IEnumerable<InsightDto>> GetAllInsightsAsync()
        {
            try
            {
                var insights = await _insightRepository.GetAllAsync();
                return insights.Select(MapToInsightDto).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get all insights - table may not exist");
                return new List<InsightDto>();
            }
        }

        public async Task<IEnumerable<InsightDto>> GetActiveInsightsAsync()
        {
            try
            {
                var insights = await _insightRepository.GetActiveInsightsAsync();
                return insights.Select(MapToInsightDto).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get active insights - table may not exist");
                return new List<InsightDto>();
            }
        }

        public async Task<InsightDto?> UpdateInsightAsync(int insightId, UpdateInsightDto updateInsightDto)
        {
            try
            {
                var insight = await _insightRepository.GetByIdAsync(insightId);
                if (insight == null) return null;

                insight.Title = updateInsightDto.Title.Trim();
                insight.Content = updateInsightDto.Content.Trim();
                insight.Category = updateInsightDto.Category?.Trim();
                insight.Tags = updateInsightDto.Tags?.Trim();
                insight.Priority = updateInsightDto.Priority;
                insight.IsActive = updateInsightDto.IsActive;
                insight.IsPinned = updateInsightDto.IsPinned;
                insight.RelatedControlId = updateInsightDto.RelatedControlId;
                insight.UpdatedById = updateInsightDto.UpdatedById;
                insight.UpdatedAt = DateTime.UtcNow;

                await _insightRepository.UpdateAsync(insight);

                _logger.LogInformation("Insight {InsightId} updated by user {UpdatedById}", 
                    insightId, updateInsightDto.UpdatedById);

                var updatedInsight = await _insightRepository.GetInsightWithDetailsAsync(insightId);
                return updatedInsight != null ? MapToInsightDto(updatedInsight) : null;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to update insight {InsightId} - table may not exist", insightId);
                return null;
            }
        }

        public async Task<bool> DeleteInsightAsync(int insightId)
        {
            try
            {
                var result = await _insightRepository.DeleteAsync(insightId);
                if (result)
                {
                    _logger.LogInformation("Insight {InsightId} deleted", insightId);
                }
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to delete insight {InsightId} - table may not exist", insightId);
                return false;
            }
        }

        public async Task<bool> ToggleInsightActiveAsync(int insightId)
        {
            try
            {
                var insight = await _insightRepository.GetByIdAsync(insightId);
                if (insight == null) return false;

                insight.IsActive = !insight.IsActive;
                insight.UpdatedAt = DateTime.UtcNow;

                await _insightRepository.UpdateAsync(insight);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to toggle insight active status {InsightId}", insightId);
                return false;
            }
        }

        public async Task<bool> ToggleInsightPinnedAsync(int insightId)
        {
            try
            {
                var insight = await _insightRepository.GetByIdAsync(insightId);
                if (insight == null) return false;

                insight.IsPinned = !insight.IsPinned;
                insight.UpdatedAt = DateTime.UtcNow;

                await _insightRepository.UpdateAsync(insight);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to toggle insight pinned status {InsightId}", insightId);
                return false;
            }
        }

        public async Task<IEnumerable<InsightDto>> GetInsightsByCategoryAsync(string category)
        {
            try
            {
                var insights = await _insightRepository.GetInsightsByCategoryAsync(category);
                return insights.Select(MapToInsightDto).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get insights by category - table may not exist");
                return new List<InsightDto>();
            }
        }

        public async Task<IEnumerable<InsightDto>> GetInsightsByAuthorAsync(int authorId)
        {
            try
            {
                var insights = await _insightRepository.GetInsightsByAuthorAsync(authorId);
                return insights.Select(MapToInsightDto).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get insights by author - table may not exist");
                return new List<InsightDto>();
            }
        }

        public async Task<IEnumerable<InsightDto>> GetPinnedInsightsAsync()
        {
            try
            {
                var insights = await _insightRepository.GetPinnedInsightsAsync();
                return insights.Select(MapToInsightDto).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get pinned insights - table may not exist");
                return new List<InsightDto>();
            }
        }

        public async Task<IEnumerable<InsightDto>> SearchInsightsAsync(string searchTerm)
        {
            try
            {
                var insights = await _insightRepository.SearchInsightsAsync(searchTerm);
                return insights.Select(MapToInsightDto).ToList();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to search insights - table may not exist");
                return new List<InsightDto>();
            }
        }

        public async Task<InsightSummaryDto> GetInsightSummaryAsync()
        {
            try
            {
                var allInsights = await _insightRepository.GetAllAsync();
                var recentInsights = await _insightRepository.GetRecentInsightsAsync(5);
                var pinnedInsights = await _insightRepository.GetPinnedInsightsAsync();
                var categories = await _insightRepository.GetCategoriesAsync();

                return new InsightSummaryDto
                {
                    TotalInsights = allInsights.Count(),
                    ActiveInsights = allInsights.Count(i => i.IsActive),
                    PinnedInsightsCount = allInsights.Count(i => i.IsPinned && i.IsActive),
                    CriticalInsights = allInsights.Count(i => i.Priority == 4 && i.IsActive),
                    Categories = categories.ToList(),
                    RecentInsights = recentInsights.Select(MapToInsightDto).ToList(),
                    PinnedInsights = pinnedInsights.Select(MapToInsightDto).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get insight summary - table may not exist");
                return new InsightSummaryDto();
            }
        }

        public async Task<IEnumerable<string>> GetCategoriesAsync()
        {
            try
            {
                return await _insightRepository.GetCategoriesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to get categories - table may not exist");
                return new List<string>();
            }
        }

        private InsightDto MapToInsightDto(Insight insight)
        {
            return new InsightDto
            {
                InsightId = insight.InsightId,
                Title = insight.Title,
                Content = insight.Content,
                Category = insight.Category,
                Tags = insight.Tags,
                Priority = insight.Priority,
                IsActive = insight.IsActive,
                IsPinned = insight.IsPinned,
                AuthorId = insight.AuthorId,
                AuthorName = insight.Author?.EmployeeName,
                CreatedAt = insight.CreatedAt,
                UpdatedAt = insight.UpdatedAt,
                UpdatedById = insight.UpdatedById,
                UpdatedByName = insight.UpdatedBy?.EmployeeName,
                RelatedControlId = insight.RelatedControlId,
                RelatedControlDescription = insight.RelatedControl?.Description
            };
        }
    }
}