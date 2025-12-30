using StudentEnrollment.Features.Common.Requests;

namespace StudentEnrollment.Features.Students.Create;

public record CreateStudentRequest(
    string Cnp,
    string FirstName,
    string LastName,
    DateOnly DateOfBirth,
    string Email,
    string PhoneNumber,
    AddressRequest Address,
    int? UserId
);