using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Auth.Login;

public class LoginEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/login", async (
                [FromBody] LoginRequest loginRequest,
                [FromServices] LoginHandler handler
            ) => await handler.HandleAsync(loginRequest))
            .WithName("Login")
            .AllowAnonymous()
            .Produces(StatusCodes.Status200OK, typeof(LoginResponse))
            .Produces(StatusCodes.Status401Unauthorized, typeof(ProblemDetails));
    }
}