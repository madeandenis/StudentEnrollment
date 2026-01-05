using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Students.Common.Interfaces;

public interface IStudentResponse
{
    int Id { get; set; }
    string StudentCode { get; set; }
    string Cnp { get; set; }
    string FirstName { get; set; }
    string LastName { get; set; }
    DateOnly DateOfBirth { get; set; }
    string Email { get; set; }
    string PhoneNumber { get; set; }
    Address Address { get; set; }
}