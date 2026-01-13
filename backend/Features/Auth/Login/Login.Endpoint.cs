using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Features.Auth.Login;

public class LoginEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                "/login",
                async (
                    HttpContext httpContext,
                    [FromBody] LoginRequest request,
                    [FromServices] LoginHandler handler,
                    [FromServices] AuthCookieFactory cookieFactory
                ) =>
                {
                    var result = await handler.HandleAsync(request);

                    if (result is Ok<LoginResponse> okResult)
                    {
                        LoginResponse loginResponse = okResult.Value!;

                        httpContext.Response.Cookies.Append(
                            "RefreshToken",
                            loginResponse.RefreshToken,
                            cookieFactory.CreateRefreshTokenOptions(
                                loginResponse.RefreshTokenExpiresAt
                            )
                        );
                    }

                    return result;
                }
            )
            .WithName("Login")
            .RequireRateLimiting("Auth")
            .AllowAnonymous()
            .Produces(StatusCodes.Status200OK, typeof(LoginResponse))
            .Produces(StatusCodes.Status401Unauthorized, typeof(ProblemDetails));
    }
}
