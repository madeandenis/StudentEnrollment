using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace StudentEnrollment.Shared.ErrorHandling;

/// <summary>
/// Global exception handler for ASP.NET Core applications.
/// Handles exceptions centrally and converts them to standardized <see cref="ProblemDetails"/> responses.
/// Provides user-friendly messages for known exception types and logs all exceptions for diagnostics.
/// </summary>
public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    
    /// <summary>
    /// Attempts to handle an exception and write a standardized <see cref="ProblemDetails"/> response.
    /// </summary>
    /// <param name="httpContext">The current HTTP context.</param>
    /// <param name="exception">The exception that occurred.</param>
    /// <param name="cancellationToken">Cancellation token for async operations.</param>
    /// <returns>
    /// <c>true</c> always, indicating that the exception was handled successfully and a response was written.
    /// </returns>
    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken
    )
    {
        ProblemDetails problemDetails;

        if (exception is UnauthorizedAccessException)
        {
            // Warning exception represents a user-level issue
            logger.LogWarning(
                exception,
                "Unauthorized request to {Path} using {Method}. No current user found.",
                httpContext.Request.Path,
                httpContext.Request.Method
            );
            
            problemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status401Unauthorized,
                Title = "Neautorizat",
                Detail = "Va rugam sa va autentificati pentru a continua.",
                Type = "https://datatracker.ietf.org/doc/html/rfc7235#section-3.1"
            };
        }
        else
        {
            // Unexpected server-side exception
            logger.LogError(
                exception,
                "Unhandled exception occurred on {Path} using {Method}. Exception message: {Message}",
                httpContext.Request.Path,
                httpContext.Request.Method,
                exception.Message
            );

            problemDetails = new ProblemDetails
            {
                Status = StatusCodes.Status500InternalServerError,
                Title = "Server Error",
                Detail = "A aparut o eroare interna. Te rugam sa incerci mai tarziu.",
                Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1",
            };
        }

        httpContext.Response.StatusCode = problemDetails.Status.Value;

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}