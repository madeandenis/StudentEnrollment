using Microsoft.AspNetCore.Mvc;

namespace StudentEnrollment.Features.Common;

/// <summary>
/// Provides factory methods for creating standardized <see cref="ProblemDetails"/> responses for common HTTP error scenarios.
/// </summary>
public static class Problems
{
 
    public static ProblemDetails BadRequest(string detail) =>
        new()
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "Bad Request",
            Detail = detail,
        };

    public static ProblemDetails NotFound(string detail = "Resource not found") =>
        new()
        {
            Status = StatusCodes.Status404NotFound,
            Title = "Not Found",
            Detail = detail,
        };

    public static ProblemDetails Unauthorized(string detail = "Authentication required") =>
        new()
        {
            Status = StatusCodes.Status401Unauthorized,
            Title = "Unauthorized",
            Detail = detail,
        };

    public static ProblemDetails Forbidden(string detail = "Access denied") =>
        new()
        {
            Status = StatusCodes.Status403Forbidden,
            Title = "Forbidden",
            Detail = detail
        };

    public static ProblemDetails Conflict(string detail = "A conflict occurred") =>
        new()
        {
            Status = StatusCodes.Status409Conflict,
            Title = "Conflict",
            Detail = detail,
        };
}
