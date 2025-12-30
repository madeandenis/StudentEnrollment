using Microsoft.AspNetCore.Identity;

namespace StudentEnrollment.Shared.Domain.Entities.Identity;

public class ApplicationUser : IdentityUser<int>
{
    public ICollection<RefreshToken> RefreshTokens { get; set; }
    public virtual ICollection<ApplicationUserToken> Tokens { get; set; }
    public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }
}
