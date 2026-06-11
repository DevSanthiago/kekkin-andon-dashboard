using KekkinAndon.API.Dtos;

namespace KekkinAndon.API.Services;

public interface IAbsenteeismAnalyticsService
{
    Task<DashboardDto> BuildDashboardAsync(string? month, string? shift, int? headcount, string? employee, CancellationToken cancellationToken);
}
