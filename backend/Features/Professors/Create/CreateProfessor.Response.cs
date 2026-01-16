using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Professors.Create;

public record CreateProfessorResponse(
    int Id,
    string ProfessorCode,
    int UserId,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    Address Address
);