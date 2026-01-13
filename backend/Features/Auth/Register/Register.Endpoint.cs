using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Auth.Register;

public class RegisterEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                "/register",
                async (
                    [FromBody] RegisterRequest request,
                    [FromServices] RegisterHandler handler
                ) => await handler.HandleAsync(request)
            )
            .WithName("Register")
            .RequireRateLimiting("Auth")
            .AllowAnonymous()
            .Produces<ClaimsUser>(StatusCodes.Status201Created)
            .Produces(StatusCodes.Status409Conflict, typeof(ProblemDetails))
            .Produces(StatusCodes.Status400BadRequest, typeof(ProblemDetails));
    }
}
