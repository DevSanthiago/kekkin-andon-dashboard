namespace KekkinAndon.API.Services;

public static class CsvLineParser
{
    public static IEnumerable<string[]> Parse(string content)
    {
        var fields = new List<string>();
        var current = new System.Text.StringBuilder();
        var inQuotes = false;

        for (var i = 0; i < content.Length; i++)
        {
            var c = content[i];

            if (inQuotes)
            {
                if (c == '"')
                {
                    if (i + 1 < content.Length && content[i + 1] == '"')
                    {
                        current.Append('"');
                        i++;
                    }
                    else
                    {
                        inQuotes = false;
                    }
                }
                else
                {
                    current.Append(c);
                }
                continue;
            }

            switch (c)
            {
                case '"':
                    inQuotes = true;
                    break;
                case ',':
                    fields.Add(current.ToString());
                    current.Clear();
                    break;
                case '\r':
                    break;
                case '\n':
                    fields.Add(current.ToString());
                    current.Clear();
                    yield return fields.ToArray();
                    fields.Clear();
                    break;
                default:
                    current.Append(c);
                    break;
            }
        }

        if (current.Length > 0 || fields.Count > 0)
        {
            fields.Add(current.ToString());
            yield return fields.ToArray();
        }
    }
}
