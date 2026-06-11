namespace KekkinAndon.API.Dtos;

public record DashboardDto(
    KpisDto Kpis,
    IReadOnlyList<MonthlyPointDto> MonthlyTrend,
    IReadOnlyList<BreakdownItemDto> ByType,
    IReadOnlyList<BreakdownItemDto> ByShift,
    IReadOnlyList<BreakdownItemDto> ByManager,
    IReadOnlyList<BreakdownItemDto> ByJustification,
    IReadOnlyList<RepeatOffenderDto> TopRecurrences,
    IReadOnlyList<DailyPointDto> DailySeries,
    MetaDto Meta);

public record KpisDto(
    int TotalAbsenceDays,
    int DistinctEmployees,
    double AbsenteeismRate,
    int UnjustifiedDays,
    double UnjustifiedShare,
    int MedicalDays,
    double MedicalShare,
    double AvgDaysPerEmployee);

public record MonthlyPointDto(string Month, int Year, int MonthNumber, int Total, int Unjustified, int Medical, double Rate);

public record BreakdownItemDto(string Label, int Value, double Share);

public record RepeatOffenderDto(string Registration, string Name, string Shift, string Manager, int Days);

public record DailyPointDto(string Date, int Total);

public record EmployeeDto(string Registration, string Name);

public record MetaDto(
    int Headcount,
    int WorkingDays,
    string PeriodStart,
    string PeriodEnd,
    string GeneratedAt,
    IReadOnlyList<string> AvailableMonths,
    IReadOnlyList<string> AvailableShifts,
    IReadOnlyList<EmployeeDto> Employees);
