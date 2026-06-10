using System.Globalization;
using KekkinAndon.API.Models;

namespace KekkinAndon.API.Services;

public class GoogleSheetAbsenceClient : IAbsenceSheetClient
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public GoogleSheetAbsenceClient(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    public async Task<IReadOnlyList<AbsenceRecord>> GetRecordsAsync(CancellationToken cancellationToken)
    {
        var sheetId = _configuration["GoogleSheet:SpreadsheetId"]
            ?? throw new InvalidOperationException("GoogleSheet:SpreadsheetId não configurado.");
        var gid = _configuration["GoogleSheet:Gid"] ?? "0";

        var url = $"https://docs.google.com/spreadsheets/d/{sheetId}/export?format=csv&gid={gid}";
        var client = _httpClientFactory.CreateClient("GoogleSheets");
        var csv = await client.GetStringAsync(url, cancellationToken);

        var rows = CsvLineParser.Parse(csv).Skip(1);
        var records = new List<AbsenceRecord>();

        foreach (var row in rows)
        {
            if (row.Length < 11) continue;

            var registration = row[1].Trim();
            if (string.IsNullOrEmpty(registration)) continue;

            records.Add(new AbsenceRecord
            {
                FilledAt = ParseDate(row[0]),
                Registration = registration,
                Name = row[2].Trim(),
                AbsenceDate = ParseDate(row[3]),
                Type = Normalize(row[4]),
                Justification = Normalize(row[5]),
                Shift = Normalize(row[6]),
                Manager = Normalize(row[7]),
                ProductionLine = Normalize(row[8]),
                Feedback = Normalize(row[9]),
                Notes = row[10].Trim()
            });
        }

        return records;
    }

    private static DateOnly? ParseDate(string value) =>
        DateOnly.TryParseExact(value.Trim(), "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date)
            ? date
            : null;

    private static string Normalize(string value) =>
        value.Trim().ToUpperInvariant();
}
