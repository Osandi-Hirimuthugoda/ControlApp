using ControlApp.API.Models;

namespace ControlApp.API.Repositories
{
    public interface IControlRepository : IRepository<Controls>
    {
        Task<IEnumerable<Controls>> GetControlsWithDetailsAsync(string? searchTerm = null);
        Task<Controls?> GetControlWithDetailsByIdAsync(int id);
    }
}

