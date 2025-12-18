using Microsoft.AspNetCore.Identity;

namespace StudentEnrollment.Shared.Domain.Entities.Identity;

public class ApplicationUser : IdentityUser<int>
{
    public virtual ICollection<ApplicationUserToken> Tokens { get; set; }
    public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }
}