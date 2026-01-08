using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Students.GetDetails;

public record StudentDetailsResponse(
    int Id,
    string StudentCode,
    string Cnp,
    string FirstName,
    string LastName,
    DateOnly DateOfBirth,
    string Email,
    string PhoneNumber,
    Address Address
);