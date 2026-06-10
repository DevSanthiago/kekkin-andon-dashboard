namespace KekkinAndon.API.Models;

public class AbsenceRecord
{
    public DateOnly? FilledAt { get; init; }
    public string Registration { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public DateOnly? AbsenceDate { get; init; }
    public string Type { get; init; } = string.Empty;
    public string Justification { get; init; } = string.Empty;
    public string Shift { get; init; } = string.Empty;
    public string Manager { get; init; } = string.Empty;
    public string ProductionLine { get; init; } = string.Empty;
    public string Feedback { get; init; } = string.Empty;
    public string Notes { get; init; } = string.Empty;

    public bool IsUnjustified =>
        Type.Contains("SEM JUSTIFICATIVA", StringComparison.OrdinalIgnoreCase)
        || Type.Contains("ABANDONO", StringComparison.OrdinalIgnoreCase);

    public bool IsMedical =>
        Type.Contains("ATESTADO", StringComparison.OrdinalIgnoreCase);
}
