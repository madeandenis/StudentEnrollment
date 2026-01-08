using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Auth.RefreshToken;

public class RefreshTokenEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/refresh", async (
                [FromBody] RefreshTokenRequest request,
                [FromServices] RefreshTokenHandler handler
            ) => await handler.HandleAsync(request))
            .WithName("RefreshToken")
            .AllowAnonymous()
            .Produces(StatusCodes.Status200OK, typeof(RefreshTokenResponse))
            .Produces(StatusCodes.Status400BadRequest, typeof(ProblemDetails))
            .Produces(StatusCodes.Status401Unauthorized);
    }
}