using StudentEnrollment.Features.Professors.Common.Interfaces;
using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Professors.Update;

public record UpdateProfessorRequest(
    int UserId,
    string FirstName,
    string LastName,
    string Email,
    string PhoneNumber,
    Address Address
) : IProfessorRequest;
