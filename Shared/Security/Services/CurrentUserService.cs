using System.Security.Claims;
using StudentEnrollment.Shared.Security.Common;

namespace StudentEnrollment.Shared.Security.Services;

/// <summary>
/// Provides access to the current authenticated user's ID from the HTTP context.
/// </summary>
public sealed class CurrentUserService(IHttpContextAccessor httpContextAccessor)
{
    /// <summary>
    /// Gets the current authenticated user's ID.
    /// </summary>
    /// <returns>The user ID if the user is authenticated; otherwise, <c>null</c>.</returns>
    public int? UserId()
    {
       var nameIdentifier = httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(nameIdentifier, out var userId) ? userId : null;
    }
    
    /// <summary>
    /// Gets the current authenticated user's ID, throwing an exception if the user is not authenticated.
    /// </summary>
    /// <returns>The user ID.</returns>
    /// <exception cref="UnauthorizedAccessException">Thrown when there is no authenticated user in the current HTTP context.</exception>
    public int RequiredUserId() => UserId() ?? throw new UnauthorizedAccessException();
    
    /// <summary>
    /// Gets the current authenticated user's student ID, if any. This is typically used to determine whether the user is a student.
    /// </summary>
    /// <returns>The student ID if the claim exists and is valid; otherwise, <c>null</c>.</returns>
    public int? StudentId()
    {
        var studentIdClaim = httpContextAccessor.HttpContext?.User.FindFirstValue(ApplicationUserClaims.StudentCode);
        return int.TryParse(studentIdClaim, out var studentId) ? studentId : null;
    }
}