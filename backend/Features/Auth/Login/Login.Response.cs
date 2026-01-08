using System.Security.Claims;
using StudentEnrollment.Features.Common;

namespace StudentEnrollment.Features.Auth.Login;

public record LoginResponse(
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpiresAt,
    DateTime RefreshTokenExpiresAt,
    ClaimsUser User,
    string TokenType = "Bearer"
);
