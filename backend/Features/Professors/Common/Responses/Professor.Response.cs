using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Professors.Common.Responses;

public record ProfessorResponse
{
    public int Id { get; init; }
    public string ProfessorCode { get; init; } = string.Empty;
    public int UserId { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string PhoneNumber { get; init; } = string.Empty;
    public Address? Address { get; init; }
    public DateTime CreatedAt { get; init; }
}
