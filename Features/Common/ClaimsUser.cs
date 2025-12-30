using System.Security.Claims;
using StudentEnrollment.Shared.Security.Common;

namespace StudentEnrollment.Features.Common;

/// <summary>
/// Represents a user's claims, including identification details, roles, and student-related data.
/// </summary>
public record ClaimsUser(
    string UserId,
    string? UserName,
    string? FirstName,
    string? LastName,
    string? Email,
    string? PhoneNumber,
    IEnumerable<string> Roles,
    string? StudentCode
)
{
    /// <summary>
    /// Creates a <see cref="ClaimsUser"/> instance from a <see cref="ClaimsIdentity"/>.
    /// </summary>
    /// <exception cref="Exception">Thrown when the user ID claim is missing from the identity.</exception>
    public static ClaimsUser FromClaimsIdentity(ClaimsIdentity identity)
    {
        var claims = identity.Claims.ToArray();

        return new ClaimsUser(
            UserId: claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value
                ?? throw new Exception("Missing user ID claim"),
            UserName: claims.FirstOrDefault(c => c.Type == ClaimTypes.Name)?.Value,
            FirstName: claims.FirstOrDefault(c => c.Type == ClaimTypes.GivenName)?.Value,
            LastName: claims.FirstOrDefault(c => c.Type == ClaimTypes.Surname)?.Value,
            Email: claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value,
            PhoneNumber: claims.FirstOrDefault(c => c.Type == ClaimTypes.MobilePhone)?.Value,
            Roles: claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value),
            StudentCode: claims
                .FirstOrDefault(c => c.Type == ApplicationUserClaims.StudentCode)
                ?.Value
        );
    }
}
