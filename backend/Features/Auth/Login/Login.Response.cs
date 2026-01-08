using System.Security.Claims;
using StudentEnrollment.Features.Common;

namespace StudentEnrollment.Features.Auth.Login;

public record LoginResponse(
    string TokenType,
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpiresAt,
    DateTime RefreshTokenExpiresAt,
    ClaimsUser User
)
{
    public LoginResponse
    ((
            string AccessToken,
            string RefreshToken,
            DateTime AccessTokenExpiresAt,
            DateTime RefreshTokenExpiresAt) tokens,
        ClaimsIdentity identity
    )
        : this(
            TokenType: "Bearer",
            AccessToken: tokens.AccessToken,
            RefreshToken: tokens.RefreshToken,
            AccessTokenExpiresAt: tokens.AccessTokenExpiresAt,
            RefreshTokenExpiresAt: tokens.RefreshTokenExpiresAt,
            User: ClaimsUser.FromClaimsIdentity(identity)
        )
    {
    }
};