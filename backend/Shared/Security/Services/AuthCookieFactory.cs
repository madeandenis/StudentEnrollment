namespace StudentEnrollment.Shared.Security.Services;


/// <summary>
/// Factory class for creating and managing authentication-related cookies.
/// Handles refresh token cookie creation and secure deletion.
/// </summary>
public class AuthCookieFactory
{
    private readonly IWebHostEnvironment _environment;

    public AuthCookieFactory(IWebHostEnvironment environment)
    {
        _environment = environment;
    }

    /// <summary>
    /// Creates <see cref="CookieOptions"/> for a refresh token cookie.
    /// Ensures the cookie is secure, HTTP-only, and has an expiration date.
    /// </summary>
    /// <param name="expiresAt">The UTC date and time when the cookie should expire.</param>
    /// <returns>A <see cref="CookieOptions"/> object configured for the refresh token.</returns>
    public CookieOptions CreateRefreshTokenOptions(DateTime expiresAt)
    {
        return new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            // In Development we use SameSite=None to allow cross-site requests (HTTP -> HTTPS)
            SameSite = _environment.IsDevelopment() ? SameSiteMode.None : SameSiteMode.Strict,
            Expires = expiresAt,
        };
    }
    
    /// <summary>
    /// Creates <see cref="CookieOptions"/> for deleting the refresh token cookie.
    /// Sets the expiration date in the past to ensure the browser removes the cookie.
    /// </summary>
    /// <returns>A <see cref="CookieOptions"/> object configured for secure deletion of the refresh token cookie.</returns>
    public CookieOptions CreateDeleteRefreshTokenOptions()
    {
        return new CookieOptions
        {
            Path = "/", // Must match the original cookie path to ensure the browser deletes it
            HttpOnly = true,
            Secure = true,
            SameSite = _environment.IsDevelopment() ? SameSiteMode.None : SameSiteMode.Strict,
            Expires = DateTime.UnixEpoch, // sets it in the past
        };
    }
}
