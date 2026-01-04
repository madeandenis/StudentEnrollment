namespace StudentEnrollment.Shared.Utilities;

public static class StringNormalizationService
{
    /// <summary> Removes leading and trailing whitespace. </summary>
    public static string Normalize(string value) 
        => value.Trim();
    
    /// <summary> 
    /// Normalizes an optional string. Returns null if the input is null. 
    /// </summary>
    public static string? NormalizeOptional(string? value)
        => value is null ? null : Normalize(value);
    
    /// <summary> Normalizes an email address by trimming and converting to uppercase. </summary>
    public static string NormalizeEmail(string value)
        => value.Trim().ToUpperInvariant();
}