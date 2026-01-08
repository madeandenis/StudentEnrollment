using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Features.Auth.RefreshToken;

public class RefreshTokenEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost(
                "/refresh",
                async (HttpContext httpContext, [FromServices] RefreshTokenHandler handler) =>
                {
                    var providedToken = httpContext.Request.Cookies["RefreshToken"];

                    if (string.IsNullOrWhiteSpace(providedToken))
                    {
                        return Results.Unauthorized();
                    }

                    var result = await handler.HandleAsync(providedToken);

                    if (result is Ok<RefreshTokenResponse> okResult)
                    {
                        RefreshTokenResponse loginResponse = okResult.Value!;

                        httpContext.Response.Cookies.Append(
                            "RefreshToken",
                            loginResponse.RefreshToken,
                            AuthCookieFactory.CreateRefreshTokenOptions(
                                loginResponse.RefreshTokenExpiresAt
                            )
                        );
                    }

                    return result;
                }
            )
            .WithName("RefreshToken")
            .AllowAnonymous()
            .Produces(StatusCodes.Status200OK, typeof(RefreshTokenResponse))
            .Produces(StatusCodes.Status400BadRequest, typeof(ProblemDetails))
            .Produces(StatusCodes.Status401Unauthorized);
    }
}
