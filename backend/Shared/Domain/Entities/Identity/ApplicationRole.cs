using Microsoft.AspNetCore.Identity;

namespace StudentEnrollment.Shared.Domain.Entities.Identity;

public class ApplicationRole : IdentityRole<int>
{
    public virtual ICollection<ApplicationUserRole> UserRoles { get; set; }
}
