using KekkinAndon.API.Models;

namespace KekkinAndon.API.Services;

public interface IDisciplinarySheetClient
{
    Task<IReadOnlyList<DisciplinaryRecord>> GetRecordsAsync(CancellationToken cancellationToken);
}
