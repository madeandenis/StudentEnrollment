using System.Collections.ObjectModel;

namespace StudentEnrollment.Shared.Utilities;

public static class CnpService
{
    private static readonly int[] ControlKey = { 2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9 };

    private static readonly ReadOnlyDictionary<string, string> CountyCodes = new(new Dictionary<string, string>
    {
        { "01", "Alba" }, { "02", "Arad" }, { "03", "Argeș" }, { "04", "Bacău" }, { "05", "Bihor" },
        { "06", "Bistrița-Năsăud" }, { "07", "Botoșani" }, { "08", "Brașov" }, { "09", "Brăila" }, { "10", "Buzău" },
        { "11", "Caraș-Severin" }, { "12", "Cluj" }, { "13", "Constanța" }, { "14", "Covasna" }, { "15", "Dambovița" },
        { "16", "Dolj" }, { "17", "Galați" }, { "18", "Gorj" }, { "19", "Harghita" }, { "20", "Hunedoara" },
        { "21", "Ialomița" }, { "22", "Iași" }, { "23", "Ilfov" }, { "24", "Maramureș" }, { "25", "Mehedinți" },
        { "26", "Mureș" }, { "27", "Neamț" }, { "28", "Olt" }, { "29", "Prahova" }, { "30", "Satu Mare" },
        { "31", "Sălaj" }, { "32", "Sibiu" }, { "33", "Suceava" }, { "34", "Teleorman" }, { "35", "Timiș" },
        { "36", "Tulcea" }, { "37", "Vaslui" }, { "38", "Vâlcea" }, { "39", "Vrancea" }, { "40", "București" },
        { "41", "București - Sector 1" }, { "42", "București - Sector 2" }, { "43", "București - Sector 3" },
        { "44", "București - Sector 4" }, { "45", "București - Sector 5" }, { "46", "București - Sector 6" },
        { "51", "Calarași" }, { "52", "Giurgiu" }, { "80", "CNP obținut în străinătate" }
    });

    public static bool Validate(string cnp)
    {
        if (string.IsNullOrWhiteSpace(cnp) || cnp.Length != 13 || !cnp.All(char.IsDigit))
            return false;

        int[] digits = cnp.Select(c => c - '0').ToArray();

        return ValidateStructure(digits, cnp) && ValidateChecksum(digits);
    }
    
    public static bool ValidateStructure(int[] digits, string cnp)
    {
        return CheckDate(digits) && CheckCounty(cnp);
    }

    public static bool ValidateStructure(string cnp)
    {
        int[] digits = cnp.Select(c => c - '0').ToArray();
        return CheckDate(digits) && CheckCounty(cnp);
    }
    
    public static bool ValidateChecksum(int[] digits)
    {
        return CheckHash(digits);
    }
    
    public static bool ValidateChecksum(string cnp)
    {
        int[] digits = cnp.Select(c => c - '0').ToArray();
        return CheckHash(digits);
    }

    public static DateOnly? GetBirthDate(string cnp)
    {
        if (!Validate(cnp))
            return null;

        var birthDate = ExtractBirthDate(cnp.Select(c => c - '0').ToArray());
        
        if (birthDate is null)
            return null;

        return DateOnly.FromDateTime(birthDate.Value);
    }

    public static string? GetBirthPlace(string cnp)
    {
        if (!Validate(cnp)) return null;
        string cc = cnp.Substring(7, 2);
        return CountyCodes.GetValueOrDefault(cc);
    }

    public static string GetGender(string cnp, string maleLabel = "male", string femaleLabel = "female")
    {
        if (!Validate(cnp)) return "unknown";
        int s = cnp[0] - '0';
        return (s % 2 != 0) ? maleLabel : femaleLabel;
    }

    private static bool CheckDate(int[] digits) => ExtractBirthDate(digits) != null;

    private static bool CheckCounty(string cnp) => CountyCodes.ContainsKey(cnp.Substring(7, 2));

    private static bool CheckHash(int[] digits)
    {
        int sum = 0;
        for (int i = 0; i < 12; i++)
            sum += digits[i] * ControlKey[i];

        int remainder = sum % 11;
        int expectedControl = (remainder == 10) ? 1 : remainder;

        return digits[12] == expectedControl;
    }

    private static DateTime? ExtractBirthDate(int[] digits)
    {
        int year = digits[1] * 10 + digits[2];
        int month = digits[3] * 10 + digits[4];
        int day = digits[5] * 10 + digits[6];
        int s = digits[0];

        int fullYear = s switch
        {
            1 or 2 => 1900 + year,
            3 or 4 => 1800 + year,
            5 or 6 => 2000 + year,
            7 or 8 or 9 => GetResidentYear(year),
            _ => 0
        };

        try
        {
            return new DateTime(fullYear, month, day);
        }
        catch
        {
            return null;
        }
    }

    private static int GetResidentYear(int yy)
    {
        int currentYearShort = DateTime.Now.Year % 100;
        return (yy > currentYearShort) ? 1900 + yy : 2000 + yy;
    }
}