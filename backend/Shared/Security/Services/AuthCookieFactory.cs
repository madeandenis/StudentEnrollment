namespace StudentEnrollment.Shared.Security.Services;

public static class AuthCookieFactory
{
    public static CookieOptions CreateRefreshTokenOptions(DateTime expiresAt) => new()
    {
        HttpOnly = true,
        Secure = true,
        SameSite = SameSiteMode.Strict,
        Expires = expiresAt
    };
}