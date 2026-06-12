using System.Globalization;
using KekkinAndon.API.Dtos;
using KekkinAndon.API.Models;
using Microsoft.Extensions.Caching.Memory;

namespace KekkinAndon.API.Services;

public class AbsenteeismAnalyticsService : IAbsenteeismAnalyticsService
{
    private const string CacheKey = "absence-records";
    private const string DisciplinaryCacheKey = "disciplinary-records";
    private static readonly CultureInfo PtBr = new("pt-BR");

    private readonly IAbsenceSheetClient _sheetClient;
    private readonly IDisciplinarySheetClient _disciplinaryClient;
    private readonly IMemoryCache _cache;
    private readonly IConfiguration _configuration;

    public AbsenteeismAnalyticsService(
        IAbsenceSheetClient sheetClient,
        IDisciplinarySheetClient disciplinaryClient,
        IMemoryCache cache,
        IConfiguration configuration)
    {
        _sheetClient = sheetClient;
        _disciplinaryClient = disciplinaryClient;
        _cache = cache;
        _configuration = configuration;
    }

    public async Task<DashboardDto> BuildDashboardAsync(string? month, string? shift, int? headcount, string? employee, CancellationToken cancellationToken)
    {
        var all = await GetCachedRecordsAsync(cancellationToken);
        var disciplinaryAll = await GetCachedDisciplinaryRecordsAsync(cancellationToken);
        var dated = all.Where(r => r.AbsenceDate.HasValue).ToList();
        var disciplinaryDated = disciplinaryAll.Where(r => r.AbsenceDate.HasValue).ToList();

        var availableMonths = dated
            .Select(r => r.AbsenceDate!.Value)
            .Select(d => $"{d.Year}-{d.Month:00}")
            .Distinct()
            .OrderBy(m => m)
            .ToList();

        var availableShifts = dated
            .Select(r => r.Shift)
            .Where(s => !string.IsNullOrEmpty(s))
            .Distinct()
            .OrderBy(s => s)
            .ToList();

        var employees = dated
            .GroupBy(r => r.Registration)
            .Select(g => new EmployeeDto(g.Key, g.OrderByDescending(r => r.AbsenceDate).First().Name))
            .OrderBy(e => e.Name)
            .ToList();

        var employeeFilter = employee?.Trim();
        var scoped = string.IsNullOrEmpty(employeeFilter)
            ? dated
            : dated.Where(r =>
                r.Registration.Equals(employeeFilter, StringComparison.OrdinalIgnoreCase)
                || r.Name.Contains(employeeFilter, StringComparison.OrdinalIgnoreCase)).ToList();

        var filtered = scoped;
        if (!string.IsNullOrEmpty(month))
            filtered = filtered.Where(r => $"{r.AbsenceDate!.Value.Year}-{r.AbsenceDate!.Value.Month:00}" == month).ToList();
        if (!string.IsNullOrEmpty(shift))
            filtered = filtered.Where(r => r.Shift.Equals(shift, StringComparison.OrdinalIgnoreCase)).ToList();

        var disciplinaryScoped = string.IsNullOrEmpty(employeeFilter)
            ? disciplinaryDated
            : disciplinaryDated.Where(r =>
                r.Registration.Equals(employeeFilter, StringComparison.OrdinalIgnoreCase)
                || r.Name.Contains(employeeFilter, StringComparison.OrdinalIgnoreCase)).ToList();

        var disciplinaryFiltered = disciplinaryScoped;
        if (!string.IsNullOrEmpty(month))
            disciplinaryFiltered = disciplinaryFiltered.Where(r => $"{r.AbsenceDate!.Value.Year}-{r.AbsenceDate!.Value.Month:00}" == month).ToList();
        if (!string.IsNullOrEmpty(shift))
            disciplinaryFiltered = disciplinaryFiltered.Where(r => r.Shift.Equals(shift, StringComparison.OrdinalIgnoreCase)).ToList();

        var effectiveHeadcount = !string.IsNullOrEmpty(employeeFilter)
            ? Math.Max(scoped.Select(r => r.Registration).Distinct().Count(), 1)
            : headcount is > 0 ? headcount.Value : _configuration.GetValue("Workforce:Headcount", 600);

        var periodScope = dated;
        if (!string.IsNullOrEmpty(month))
            periodScope = periodScope.Where(r => $"{r.AbsenceDate!.Value.Year}-{r.AbsenceDate!.Value.Month:00}" == month).ToList();
        if (!string.IsNullOrEmpty(shift))
            periodScope = periodScope.Where(r => r.Shift.Equals(shift, StringComparison.OrdinalIgnoreCase)).ToList();

        var periodStart = periodScope.Count > 0 ? periodScope.Min(r => r.AbsenceDate!.Value) : DateOnly.FromDateTime(DateTime.Today);
        var periodEnd = periodScope.Count > 0 ? periodScope.Max(r => r.AbsenceDate!.Value) : DateOnly.FromDateTime(DateTime.Today);
        var workingDays = CountWorkingDays(periodStart, periodEnd);

        return new DashboardDto(
            BuildKpis(filtered, effectiveHeadcount, workingDays),
            BuildMonthlyTrend(scoped, effectiveHeadcount),
            BuildBreakdown(filtered, r => r.Type),
            BuildBreakdown(filtered, r => r.Shift),
            BuildBreakdown(filtered, r => r.Manager, 12),
            BuildBreakdown(filtered, r => r.Justification),
            BuildTopRecurrences(filtered),
            BuildDailySeries(filtered),
            BuildDisciplinary(filtered, disciplinaryFiltered, scoped, disciplinaryScoped),
            new MetaDto(
                effectiveHeadcount,
                workingDays,
                periodStart.ToString("yyyy-MM-dd"),
                periodEnd.ToString("yyyy-MM-dd"),
                DateTimeOffset.Now.ToString("O"),
                availableMonths,
                availableShifts,
                employees));
    }

    private async Task<IReadOnlyList<AbsenceRecord>> GetCachedRecordsAsync(CancellationToken cancellationToken)
    {
        if (_cache.TryGetValue(CacheKey, out IReadOnlyList<AbsenceRecord>? cached) && cached is not null)
            return cached;

        var records = await _sheetClient.GetRecordsAsync(cancellationToken);
        var ttl = _configuration.GetValue("GoogleSheet:CacheSeconds", 60);
        _cache.Set(CacheKey, records, TimeSpan.FromSeconds(ttl));
        return records;
    }

    private async Task<IReadOnlyList<DisciplinaryRecord>> GetCachedDisciplinaryRecordsAsync(CancellationToken cancellationToken)
    {
        if (_cache.TryGetValue(DisciplinaryCacheKey, out IReadOnlyList<DisciplinaryRecord>? cached) && cached is not null)
            return cached;

        var records = await _disciplinaryClient.GetRecordsAsync(cancellationToken);
        var ttl = _configuration.GetValue("GoogleSheet:CacheSeconds", 60);
        _cache.Set(DisciplinaryCacheKey, records, TimeSpan.FromSeconds(ttl));
        return records;
    }

    private static DisciplinaryDto BuildDisciplinary(
        IReadOnlyList<AbsenceRecord> absences,
        IReadOnlyList<DisciplinaryRecord> measures,
        IReadOnlyList<AbsenceRecord> absenceTrendScope,
        IReadOnlyList<DisciplinaryRecord> measureTrendScope)
    {
        var unjustified = absences.Count(r => r.IsUnjustified);
        var applied = measures.Count(r => r.IsApplied);
        var cancelled = measures.Count - applied;

        var appliedRecords = measures.Where(r => r.IsApplied).ToList();
        var byMeasure = appliedRecords
            .GroupBy(r => string.IsNullOrEmpty(r.Measure) ? "NÃO INFORMADO" : r.Measure)
            .OrderByDescending(g => g.Count())
            .Select(g => new BreakdownItemDto(g.Key, g.Count(), Round(Share(g.Count(), applied))))
            .ToList();

        var unjustifiedByMonth = absenceTrendScope
            .Where(r => r.IsUnjustified)
            .GroupBy(r => new { r.AbsenceDate!.Value.Year, r.AbsenceDate!.Value.Month })
            .ToDictionary(g => (g.Key.Year, g.Key.Month), g => g.Count());

        var measuresByMonth = measureTrendScope
            .Where(r => r.IsApplied)
            .GroupBy(r => new { r.AbsenceDate!.Value.Year, r.AbsenceDate!.Value.Month })
            .ToDictionary(g => (g.Key.Year, g.Key.Month), g => g.Count());

        var monthlyComparison = unjustifiedByMonth.Keys
            .Union(measuresByMonth.Keys)
            .OrderBy(k => k.Item1).ThenBy(k => k.Item2)
            .Select(k =>
            {
                var monthUnjustified = unjustifiedByMonth.GetValueOrDefault(k);
                var monthMeasures = measuresByMonth.GetValueOrDefault(k);
                return new DisciplinaryMonthlyPointDto(
                    PtBr.DateTimeFormat.GetAbbreviatedMonthName(k.Item2).ToUpperInvariant().TrimEnd('.'),
                    k.Item1,
                    k.Item2,
                    monthUnjustified,
                    monthMeasures,
                    Round(Share(monthMeasures, monthUnjustified)));
            })
            .ToList();

        return new DisciplinaryDto(
            unjustified,
            applied,
            cancelled,
            Round(Share(applied, unjustified)),
            byMeasure,
            monthlyComparison);
    }

    private static KpisDto BuildKpis(IReadOnlyList<AbsenceRecord> records, int headcount, int workingDays)
    {
        var total = records.Count;
        var distinct = records.Select(r => r.Registration).Distinct().Count();
        var unjustified = records.Count(r => r.IsUnjustified);
        var medical = records.Count(r => r.IsMedical);
        var capacity = (double)headcount * Math.Max(workingDays, 1);

        return new KpisDto(
            total,
            distinct,
            Round(total / capacity * 100),
            unjustified,
            Round(Share(unjustified, total)),
            medical,
            Round(Share(medical, total)),
            Round(distinct > 0 ? (double)total / distinct : 0));
    }

    private static List<MonthlyPointDto> BuildMonthlyTrend(IReadOnlyList<AbsenceRecord> records, int headcount)
    {
        return records
            .GroupBy(r => new { r.AbsenceDate!.Value.Year, r.AbsenceDate!.Value.Month })
            .OrderBy(g => g.Key.Year).ThenBy(g => g.Key.Month)
            .Select(g =>
            {
                var monthStart = new DateOnly(g.Key.Year, g.Key.Month, 1);
                var monthEnd = monthStart.AddMonths(1).AddDays(-1);
                var capacity = (double)headcount * Math.Max(CountWorkingDays(monthStart, monthEnd), 1);
                return new MonthlyPointDto(
                    PtBr.DateTimeFormat.GetAbbreviatedMonthName(g.Key.Month).ToUpperInvariant().TrimEnd('.'),
                    g.Key.Year,
                    g.Key.Month,
                    g.Count(),
                    g.Count(r => r.IsUnjustified),
                    g.Count(r => r.IsMedical),
                    Round(g.Count() / capacity * 100));
            })
            .ToList();
    }

    private static List<BreakdownItemDto> BuildBreakdown(
        IReadOnlyList<AbsenceRecord> records,
        Func<AbsenceRecord, string> selector,
        int take = 10)
    {
        var total = records.Count;
        return records
            .GroupBy(r => string.IsNullOrEmpty(selector(r)) ? "NÃO INFORMADO" : selector(r))
            .OrderByDescending(g => g.Count())
            .Take(take)
            .Select(g => new BreakdownItemDto(g.Key, g.Count(), Round(Share(g.Count(), total))))
            .ToList();
    }

    private static List<RepeatOffenderDto> BuildTopRecurrences(IReadOnlyList<AbsenceRecord> records)
    {
        return records
            .GroupBy(r => r.Registration)
            .OrderByDescending(g => g.Count())
            .Take(10)
            .Select(g =>
            {
                var last = g.OrderByDescending(r => r.AbsenceDate).First();
                return new RepeatOffenderDto(g.Key, last.Name, last.Shift, last.Manager, g.Count());
            })
            .ToList();
    }

    private static List<DailyPointDto> BuildDailySeries(IReadOnlyList<AbsenceRecord> records)
    {
        return records
            .GroupBy(r => r.AbsenceDate!.Value)
            .OrderBy(g => g.Key)
            .Select(g => new DailyPointDto(g.Key.ToString("yyyy-MM-dd"), g.Count()))
            .ToList();
    }

    private static int CountWorkingDays(DateOnly start, DateOnly end)
    {
        var days = 0;
        for (var d = start; d <= end; d = d.AddDays(1))
            if (d.DayOfWeek is not DayOfWeek.Saturday and not DayOfWeek.Sunday)
                days++;
        return days;
    }

    private static double Share(int part, int total) => total > 0 ? (double)part / total * 100 : 0;

    private static double Round(double value) => Math.Round(value, 2);
}
