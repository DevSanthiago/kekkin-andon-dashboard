using KekkinAndon.API.Models;

namespace KekkinAndon.API.Services;

public interface IAbsenceSheetClient
{
    Task<IReadOnlyList<AbsenceRecord>> GetRecordsAsync(CancellationToken cancellationToken);
}
