namespace StudentEnrollment.Shared.Security.Services;

public class AuthCookieFactory
{
    private readonly IWebHostEnvironment _environment;

    public AuthCookieFactory(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    public CookieOptions CreateRefreshTokenOptions(DateTime expiresAt)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            // In development we use SameSite=None to allow cross-site requests (HTTP -> HTTPS)
            SameSite = _environment.IsDevelopment() ? SameSiteMode.None : SameSiteMode.Strict,
            Expires = expiresAt,
        };
    }
}
