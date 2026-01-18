using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using StudentEnrollment.Shared.Persistence;
using StudentEnrollment.Shared.Security.Common;

namespace StudentEnrollment.Shared.Security.Services;

/// <summary>
/// Provides access to the current authenticated user's information from the HTTP context and database.
/// </summary>
public sealed class CurrentUserService(
    IHttpContextAccessor httpContextAccessor,
    IServiceProvider serviceProvider
) : ICurrentUserService
{
    /// <summary>
    /// Gets the current authenticated user's ID.
    /// </summary>
    /// <returns>The user ID if the user is authenticated; otherwise, <c>null</c>.</returns>
    public int? UserId()
    {
        var nameIdentifier = httpContextAccessor.HttpContext?.User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );
        return int.TryParse(nameIdentifier, out var userId) ? userId : null;
    }

    /// <summary>
    /// Gets the current authenticated user's ID, throwing an exception if not authenticated.
    /// </summary>
    /// <returns>The authenticated user's ID.</returns>
    /// <exception cref="UnauthorizedAccessException">Thrown when the user is not authenticated.</exception>
    public int RequiredUserId()
    {
        var userId = UserId();
        if (userId is null)
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }
        return userId.Value;
    }

    /// <summary>
    /// Gets the current authenticated user's student ID (database primary key) by querying the database.
    /// This method finds the student record associated with the current user's ID.
    /// </summary>
    /// <returns>
    /// A task that represents the asynchronous operation.
    /// The task result contains the student ID if found; otherwise, <c>null</c>.
    /// </returns>
    /// <remarks>
    /// This method requires a database query and should be used sparingly.
    /// For most authorization checks, prefer using <see cref="StudentCode"/> from claims.
    /// </remarks>
    public async Task<int?> StudentIdAsync()
    {
        var userId = UserId();
        if (userId is null)
            return null;

        var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

        var studentId = await context
            .Students.AsNoTracking()
            .Where(s => s.UserId == userId)
            .Select(s => s.Id)
            .FirstOrDefaultAsync();

        return studentId == 0 ? null : studentId;
    }

    /// <summary>
    /// Gets the current authenticated user's student code from JWT claims.
    /// This is the student's unique alphanumeric identifier
    /// </summary>
    /// <returns>The student code if the claim exists; otherwise, <c>null</c>.</returns>
    /// <remarks>
    /// This method reads from claims and does not require a database query.
    /// Prefer this over <see cref="StudentIdAsync"/> for performance-critical authorization checks.
    /// </remarks>
    public string? StudentCode()
    {
        return httpContextAccessor.HttpContext?.User.FindFirstValue(
            ApplicationUserClaims.StudentCode
        );
    }

    /// <summary>
    /// Gets the current authenticated user's professor ID (database primary key) by querying the database.
    /// This method finds the professor record associated with the current user's ID.
    /// </summary>
    /// <returns>
    /// A task that represents the asynchronous operation.
    /// The task result contains the professor ID if found; otherwise, <c>null</c>.
    /// </returns>
    /// <remarks>
    /// This method requires a database query and should be used sparingly.
    /// For most authorization checks, prefer using <see cref="ProfessorCode"/> from claims.
    /// </remarks>
    public async Task<int?> ProfessorIdAsync()
    {
        var userId = UserId();
        if (userId is null)
            return null;

        var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

        var professorId = await context
            .Professors.AsNoTracking()
            .Where(p => p.UserId == userId)
            .Select(p => p.Id)
            .FirstOrDefaultAsync();

        return professorId == 0 ? null : professorId;
    }

    /// <summary>
    /// Gets the current authenticated user's professor code from JWT claims.
    /// This is the professor's unique alphanumeric identifier
    /// </summary>
    /// <returns>The professor code if the claim exists; otherwise, <c>null</c>.</returns>
    /// <remarks>
    /// This method reads from claims and does not require a database query.
    /// Prefer this over <see cref="ProfessorIdAsync"/> for performance-critical authorization checks.
    /// </remarks>
    public string? ProfessorCode()
    {
        return httpContextAccessor.HttpContext?.User.FindFirstValue(
            ApplicationUserClaims.ProfessorCode
        );
    }
}
