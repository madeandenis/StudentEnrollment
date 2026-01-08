using StudentEnrollment.Features.Students.Common.Interfaces;
using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Students.GetDetails;

public class StudentDetailsResponse : IStudentResponse
{
    public int Id { get; set; }
    public string StudentCode { get; set; }
    public string Cnp { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public Address Address { get; set; }
}