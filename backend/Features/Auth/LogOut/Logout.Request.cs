namespace StudentEnrollment.Features.Auth.LogOut;

public record LogoutRequest(string RefreshToken, bool AllDevices = false);