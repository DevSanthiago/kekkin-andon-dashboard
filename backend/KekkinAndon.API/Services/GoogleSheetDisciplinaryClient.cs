using System.Globalization;
using KekkinAndon.API.Models;

namespace KekkinAndon.API.Services;

public class GoogleSheetDisciplinaryClient : IDisciplinarySheetClient
{
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly IConfiguration _configuration;

    public GoogleSheetDisciplinaryClient(IHttpClientFactory httpClientFactory, IConfiguration configuration)
    {
        _httpClientFactory = httpClientFactory;
        _configuration = configuration;
    }

    public async Task<IReadOnlyList<DisciplinaryRecord>> GetRecordsAsync(CancellationToken cancellationToken)
    {
        var sheetId = _configuration["GoogleSheet:SpreadsheetId"]
            ?? throw new InvalidOperationException("GoogleSheet:SpreadsheetId não configurado.");
        var gid = _configuration["GoogleSheet:DisciplinaryGid"] ?? "1148699346";

        var url = $"https://docs.google.com/spreadsheets/d/{sheetId}/export?format=csv&gid={gid}";
        var client = _httpClientFactory.CreateClient("GoogleSheets");
        var csv = await client.GetStringAsync(url, cancellationToken);

        var rows = CsvLineParser.Parse(csv).Skip(1);
        var records = new List<DisciplinaryRecord>();

        foreach (var row in rows)
        {
            if (row.Length < 8) continue;

            var registration = row[1].Trim();
            if (string.IsNullOrEmpty(registration)) continue;

            records.Add(new DisciplinaryRecord
            {
                AbsenceDate = ParseDate(row[0]),
                Registration = registration,
                Name = row[2].Trim(),
                Type = Normalize(row[3]),
                Measure = Normalize(row[4]),
                Status = Normalize(row[5]),
                Notes = row[6].Trim(),
                Shift = Normalize(row[7])
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
