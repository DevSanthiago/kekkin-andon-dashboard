namespace KekkinAndon.API.Models;

public class DisciplinaryRecord
{
    public DateOnly? AbsenceDate { get; init; }
    public string Registration { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public string Measure { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public string Notes { get; init; } = string.Empty;
    public string Shift { get; init; } = string.Empty;

    public bool IsApplied =>
        !Status.Contains("CANCELADO", StringComparison.OrdinalIgnoreCase);
}
