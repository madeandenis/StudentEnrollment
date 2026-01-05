using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Students.Common.Interfaces;

/// <summary>
/// Defines the core contract for any request containing student personal and contact information.
/// Ensures consistency across Create and Update operations.
/// </summary>

public interface IStudentRequest
{
    string Cnp { get; }
    string FirstName { get; }
    string LastName { get; }
    DateOnly DateOfBirth { get; }
    string Email { get; }
    string PhoneNumber { get; }
    Address Address { get; }
}