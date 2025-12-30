using StudentEnrollment.Shared.Domain.Entities.Common.Abstractions;
using StudentEnrollment.Shared.Domain.Entities.Identity;

namespace StudentEnrollment.Shared.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public string Token { get; set; }

    public int UserId { get; set; }
    public DateTime ExpiresAt { get; set; }

    public ApplicationUser User { get; set; }
}
