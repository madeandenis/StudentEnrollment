using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Students.Common.Responses;

public record StudentResponse
{
    public int Id { get; init; }
    public string StudentCode { get; init; } = string.Empty;
    public string Cnp { get; init; } = string.Empty;
    public string FullName { get; init; } = string.Empty;
    public DateOnly DateOfBirth { get; init; }
    public string Email { get; init; } = string.Empty;
    public string PhoneNumber { get; init; } = string.Empty;
    public Address? Address { get; init; }
    public DateTime CreatedAt { get; init; }
}