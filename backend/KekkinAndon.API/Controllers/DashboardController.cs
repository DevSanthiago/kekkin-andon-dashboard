using KekkinAndon.API.Dtos;
using KekkinAndon.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace KekkinAndon.API.Controllers;

[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IAbsenteeismAnalyticsService _analytics;

    public DashboardController(IAbsenteeismAnalyticsService analytics)
    {
        _analytics = analytics;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardDto>> Get(
        [FromQuery] string? month,
        [FromQuery] string? shift,
        CancellationToken cancellationToken)
    {
        var dashboard = await _analytics.BuildDashboardAsync(month, shift, cancellationToken);
        return Ok(dashboard);
    }
}
