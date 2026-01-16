using StudentEnrollment.Features.Professors.Common.Interfaces;
using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Professors.Create;

public record CreateProfessorRequest(
    int UserId,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    Address Address
) : IProfessorRequest;
