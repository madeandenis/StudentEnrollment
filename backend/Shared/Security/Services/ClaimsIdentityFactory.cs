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
    /// Creates a <see cref="ClaimsIdentity"/> for the specified user with optional student or professor.
    /// </summary>
    /// <param name="user">The application user for whom to create the claims identity.</param>
    /// <param name="student">Optional. The student associated with the user. If provided, student-specific claims will be added.</param>
    /// <param name="professor">Optional. The professor associated with the user. If provided, professor-specific claims will be added.</param>
    /// <returns>A <see cref="ClaimsIdentity"/> populated with user, student, or professor claims.</returns>
    public async Task<ClaimsIdentity> CreateAsync(
        ApplicationUser user,
        Student? student,
        Professor? professor
    )
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
        else if (professor is not null)
        {
            identityBuilder.AddProfessorCode(professor.ProfessorCode);
            identityBuilder.AddFirstName(professor.FirstName);
            identityBuilder.AddLastName(professor.LastName);
            identityBuilder.AddFullName(professor.FirstName, professor.LastName);
            identityBuilder.AddPhoneNumber(professor.PhoneNumber);

            if (user.Email is null)
                identityBuilder.AddEmail(professor.Email);
        }

        var roles = await userManager.GetRolesAsync(user);
        identityBuilder.AddRoles(roles);

        return identityBuilder.Build();
    }

    /// <summary>
    /// Creates a <see cref="ClaimsIdentity"/> for the specified user.
    /// Automatically retrieves the associated student or professor from the database if one exists.
    /// </summary>
    /// <param name="user">The application user for whom to create the claims identity.</param>
    /// <returns>A <see cref="ClaimsIdentity"/> populated with user and student/professor claims (if applicable).</returns>
    public async Task<ClaimsIdentity> CreateAsync(ApplicationUser user)
    {
        var student = await context
            .Students.AsNoTracking()
            .FirstOrDefaultAsync(s => s.UserId == user.Id);

        var professor = await context
            .Professors.AsNoTracking()
            .FirstOrDefaultAsync(p => p.UserId == user.Id);

        return await CreateAsync(user, student, professor);
    }
}
