using Microsoft.AspNetCore.Identity;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Features.Auth.Login;

/// <summary>
/// Handles user login requests by authenticating credentials and generating JWT tokens.
/// </summary>
public class LoginHandler(
    LoginValidator validator,
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    ClaimsIdentityFactory identityFactory,
    TokenService tokenService
) : IHandler
{
    /// <summary>
    /// Handles the login request asynchronously.
    /// Validates credentials, checks account status, and generates authentication tokens upon successful login.
    /// </summary>
    /// <param name="request">The login request containing email and password.</param>
    /// <returns>
    /// An <see cref="IResult"/> containing:
    /// - 200 OK with authentication tokens and user claims if successful
    /// - 400 Bad Request if validation fails
    /// - 401 Unauthorized if credentials are invalid, account is locked, or sign-in is not allowed
    /// </returns>
    public async Task<IResult> HandleAsync(LoginRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return InvalidCredentials();

        var signinResult = await signInManager.CheckPasswordSignInAsync(
            user,
            request.Password,
            true
        );

        if (signinResult.IsLockedOut)
            return Results.Problem(Problems.Unauthorized("Account is temporarily locked."));

        if (signinResult.IsNotAllowed)
            return Results.Problem(
                Problems.Unauthorized("User cannot sign in (not confirmed or restricted).")
            );

        if (!signinResult.Succeeded)
            return InvalidCredentials();

        var identity = await identityFactory.CreateAsync(user);
        var tokens = await tokenService.GenerateTokenPairAsync(user, identity);

        return Results.Ok(new LoginResponse(
            tokens.AccessToken,
            tokens.RefreshToken,
            tokens.AccessTokenExpiresAt,
            tokens.RefreshTokenExpiresAt,
            User: ClaimsUser.FromClaimsIdentity(identity)
        ));
    }

    private IResult InvalidCredentials() =>
        Results.Problem(Problems.Unauthorized("Invalid email or password."));
}
