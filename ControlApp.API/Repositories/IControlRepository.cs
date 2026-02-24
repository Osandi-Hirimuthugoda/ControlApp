using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    // Repositories/ControlRepository.cs - Specific Implementation
    public interface IControlRepository : IRepository<Controls>
    {
        Task<IEnumerable<Controls>> GetControlsWithDetailsAsync(string? searchTerm = null);
        Task<Controls?> GetControlWithDetailsByIdAsync(int id);
    }
}

