namespace StudentEnrollment.Features.Users.Common.Responses;

public record UserResponse
{
    public int Id { get; init; }
    public string? UserName { get; init; }
    public string? Email { get; init; }
    public bool EmailConfirmed { get; init; }
    public string? PhoneNumber { get; init; }
    public bool PhoneNumberConfirmed { get; init; }
    public IEnumerable<string> Roles { get; init; } = [];
}
