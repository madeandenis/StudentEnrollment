using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Features.Professors.Common.Interfaces;

/// <summary>
/// Defines the core contract for any request containing professor personal and contact information.
/// Ensures consistency across Create and Update operations.
/// </summary>

public interface IProfessorRequest
{
    int UserId { get; }
    string FirstName { get; }
    string LastName { get; }
    string Email { get; }
    string PhoneNumber { get; }
    Address Address { get; }
}