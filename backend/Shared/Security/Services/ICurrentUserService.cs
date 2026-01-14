namespace StudentEnrollment.Shared.Security.Services;

/// <summary>
/// Interface for accessing current authenticated user information.
/// </summary>
public interface ICurrentUserService
{
    /// <summary>
    /// Gets the current authenticated user's ID.
    /// </summary>
    int? UserId();

    /// <summary>
    /// Gets the current authenticated user's ID, throwing an exception if not authenticated.
    /// </summary>
    int RequiredUserId();

    /// <summary>
    /// Gets the current authenticated user's student ID (database primary key) by querying the database.
    /// </summary>
    Task<int?> StudentIdAsync();

    /// <summary>
    /// Gets the current authenticated user's student code from JWT claims.
    /// </summary>
    string? StudentCode();
}
