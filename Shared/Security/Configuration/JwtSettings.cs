using System.ComponentModel.DataAnnotations;

namespace StudentEnrollment.Shared.Security.Configuration;

public class JwtSettings : IValidatableObject
{
    public string SecretKey { get; set; } = string.Empty;
    public string Authority { get; set; } = string.Empty;
    public string Audience { get; set; } = string.Empty;
    public int TokenExpirationInMinutes { get; set; }
    public int RefreshTokenExpirationInDays { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (string.IsNullOrEmpty(SecretKey))
        {
            yield return new ValidationResult("No Key defined in JwtSettings config", [nameof(SecretKey)]);
        }

        if (string.IsNullOrEmpty(Authority))
        {
            yield return new ValidationResult("No Authority defined in JwtSettings config", [nameof(Authority)]);
        }

        if (string.IsNullOrEmpty(Audience))
        {
            yield return new ValidationResult("No Audience defined in JwtSettings config", [nameof(Audience)]);
        }

        if (TokenExpirationInMinutes <= 0)
        {
            yield return new ValidationResult("TokenExpirationInMinutes must be greater than 0", [
                nameof(TokenExpirationInMinutes)
            ]);
        }

        if (RefreshTokenExpirationInDays <= 0)
        {
            yield return new ValidationResult("RefreshTokenExpirationInDays must be greater than 0", [
                nameof(RefreshTokenExpirationInDays)
            ]);
        }
    }
}