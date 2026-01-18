using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using StudentEnrollment.Shared.Security.Common;

namespace StudentEnrollment.Shared.Security.Services;

/// <summary>
/// Provides a builder for constructing <see cref="ClaimsIdentity"/> instances.
/// Adds standard claims recognized by JWT (<see cref="JwtRegisteredClaimNames"/>)
/// and .NET (<see cref="ClaimTypes"/>), including user ID, personal info, roles,
/// and allows custom claims.
/// </summary>
public class ClaimsIdentityBuilder
{
    private readonly ClaimsIdentity _identity = new ClaimsIdentity();

    public ClaimsIdentityBuilder AddUserId(string uid)
    {
        _identity.AddClaim(new Claim(JwtRegisteredClaimNames.Sub, uid));
        _identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, uid));
        return this;
    }

    public ClaimsIdentityBuilder AddEmail(string email)
    {
        _identity.AddClaim(new Claim(JwtRegisteredClaimNames.Email, email));
        _identity.AddClaim(new Claim(ClaimTypes.Email, email));
        return this;
    }

    public ClaimsIdentityBuilder AddFirstName(string firstName)
    {
        _identity.AddClaim(new Claim(JwtRegisteredClaimNames.GivenName, firstName));
        _identity.AddClaim(new Claim(ClaimTypes.GivenName, firstName));
        return this;
    }

    public ClaimsIdentityBuilder AddLastName(string lastName)
    {
        _identity.AddClaim(new Claim(JwtRegisteredClaimNames.FamilyName, lastName));
        _identity.AddClaim(new Claim(ClaimTypes.Surname, lastName));
        return this;
    }

    public ClaimsIdentityBuilder AddFullName(string fullName)
    {
        _identity.AddClaim(new Claim(JwtRegisteredClaimNames.Name, fullName));
        _identity.AddClaim(new Claim(ClaimTypes.Name, fullName));
        return this;
    }

    public ClaimsIdentityBuilder AddFullName(string firstName, string lastName)
    {
        AddFullName($"{firstName} {lastName}");
        return this;
    }

    public ClaimsIdentityBuilder AddPhoneNumber(string phoneNumber)
    {
        _identity.AddClaim(new Claim(JwtRegisteredClaimNames.PhoneNumber, phoneNumber));
        _identity.AddClaim(new Claim(ClaimTypes.MobilePhone, phoneNumber));
        return this;
    }

    public ClaimsIdentityBuilder AddRole(string role)
    {
        _identity.AddClaim(new Claim(ClaimTypes.Role, role));
        return this;
    }

    public ClaimsIdentityBuilder AddRoles(IEnumerable<string> roles)
    {
        foreach (var role in roles)
        {
            AddRole(role);
        }

        return this;
    }

    public ClaimsIdentityBuilder AddStudentCode(string studentCode)
    {
        _identity.AddClaim(new Claim(ApplicationUserClaims.StudentCode, studentCode));
        return this;
    }

    public ClaimsIdentityBuilder AddProfessorCode(string professorCode)
    {
        _identity.AddClaim(new Claim(ApplicationUserClaims.ProfessorCode, professorCode));
        return this;
    }

    public ClaimsIdentity Build() => _identity;
}
