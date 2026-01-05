using StudentEnrollment.Features.Students.Common.Interfaces;
using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Students.Create;

public record CreateStudentRequest(
    string Cnp,
    string FirstName,
    string LastName,
    DateOnly DateOfBirth,
    string Email,
    string PhoneNumber,
    Address Address
) : IStudentRequest;