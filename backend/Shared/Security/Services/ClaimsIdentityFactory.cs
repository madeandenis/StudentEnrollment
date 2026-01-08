using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Shared.Domain.Entities;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Shared.Security.Services;

/// <summary>
/// Factory for creating <see cref="ClaimsIdentity"/> instances populated with user and student information.
/// </summary>
public class ClaimsIdentityFactory(
    ApplicationDbContext context,
    UserManager<ApplicationUser> userManager
)
{
    /// <summary>
    /// Creates a <see cref="ClaimsIdentity"/> for the specified user and optional student.
    /// </summary>
    /// <param name="user">The application user for whom to create the claims identity.</param>
    /// <param name="student">Optional. The student associated with the user. If provided, student-specific claims will be added.</param>
    /// <returns>A <see cref="ClaimsIdentity"/> populated with user and student claims.</returns>
    public async Task<ClaimsIdentity> CreateAsync(ApplicationUser user, Student? student)
    {
        var identityBuilder = new ClaimsIdentityBuilder();

        identityBuilder.AddUserId(user.Id.ToString());

        if (user.Email is not null)
            identityBuilder.AddEmail(user.Email);

        if (student is not null)
        {
            identityBuilder.AddStudentCode(student.StudentCode);
            identityBuilder.AddFirstName(student.FirstName);
            identityBuilder.AddLastName(student.LastName);
            identityBuilder.AddFullName(student.FirstName, student.LastName);
            identityBuilder.AddPhoneNumber(student.PhoneNumber);

            if (user.Email is null)
                identityBuilder.AddEmail(student.Email);
        }

        var roles = await userManager.GetRolesAsync(user);
        identityBuilder.AddRoles(roles);

        return identityBuilder.Build();
    }

    /// <summary>
    /// Creates a <see cref="ClaimsIdentity"/> for the specified user.
    /// Automatically retrieves the associated student from the database if one exists.
    /// </summary>
    /// <param name="user">The application user for whom to create the claims identity.</param>
    /// <returns>A <see cref="ClaimsIdentity"/> populated with user and student claims (if applicable).</returns>
    public async Task<ClaimsIdentity> CreateAsync(ApplicationUser user)
    {
        var student = await context
            .Students.AsNoTracking()
            .FirstOrDefaultAsync(s => s.UserId == user.Id);

        return await CreateAsync(user, student);
    }
}
