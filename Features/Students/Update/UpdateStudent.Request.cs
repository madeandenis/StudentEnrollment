using StudentEnrollment.Features.Common.Requests;
using StudentEnrollment.Features.Students.Common.Interfaces;

namespace StudentEnrollment.Features.Students.Update;

public record UpdateStudentRequest(
    string Cnp,
    string FirstName,
    string LastName,
    DateOnly DateOfBirth,
    string Email,
    string PhoneNumber,
    AddressRequest Address
) : IStudentRequest;