using StudentEnrollment.Features.Students.Common.Interfaces;
using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Students.Create;

public record CreateStudentResponse(
    int Id,
    string StudentCode,
    string FirstName,
    string LastName,
    DateOnly DateOfBirth,
    string Email,
    string PhoneNumber,
    Address Address
);