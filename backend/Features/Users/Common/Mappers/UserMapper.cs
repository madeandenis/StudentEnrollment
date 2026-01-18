using System.Linq.Expressions;
using StudentEnrollment.Features.Users.Common.Responses;
using StudentEnrollment.Shared.Domain.Entities.Identity;

namespace StudentEnrollment.Features.Users.Common.Mappers;

public static class UserMapper
{
    /// <summary>
    /// Provides a projection expression for converting an <see cref="ApplicationUser"/> entity
    /// directly into a <see cref="UserResponse"/> at the database level.
    /// </summary>
    public static Expression<Func<ApplicationUser, UserResponse>> ProjectToResponse() =>
        user => new UserResponse
        {
            Id = user.Id,
            UserName = user.UserName,
            Email = user.Email,
            EmailConfirmed = user.EmailConfirmed,
            PhoneNumber = user.PhoneNumber,
            PhoneNumberConfirmed = user.PhoneNumberConfirmed,
            Roles = user.UserRoles.Select(ur => ur.Role.Name ?? string.Empty),
        };
}
