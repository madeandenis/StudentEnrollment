using System.Linq.Expressions;
using StudentEnrollment.Features.Students.Common.Interfaces;
using StudentEnrollment.Features.Students.Common.Responses;
using StudentEnrollment.Features.Students.Create;
using StudentEnrollment.Shared.Domain.Entities;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace StudentEnrollment.Features.Students.Common.Mappers;

/// <summary>
/// Provides mapping logic to transform between Student entities, requests, and response DTOs.
/// </summary>
public static class StudentMapper
{
    /// <summary>
    /// Provides a projection expression for converting a <see cref="Student"/> entity 
    /// directly into a <see cref="StudentResponse"/> at the database level.
    /// </summary>
    public static Expression<Func<Student, StudentResponse>> ProjectToResponse()
        => student => new StudentResponse
        {
            Id = student.Id,
            StudentCode = student.StudentCode,
            Cnp = student.CNP,
            FullName = $"{student.FirstName} {student.LastName}",
            DateOfBirth = student.DateOfBirth,
            Email = student.Email,
            PhoneNumber = student.PhoneNumber,
            Address = student.Address,
            CreatedAt = student.CreatedAt
        };

    /// <summary>
    /// Projects a <see cref="Student"/> domain entity into a <see cref="CreateStudentResponse"/> DTO.
    /// </summary>
    public static CreateStudentResponse ToCreateResponse(Student student)
        => new CreateStudentResponse(
            student.Id,
            student.StudentCode,
            student.FirstName,
            student.LastName,
            student.DateOfBirth,
            student.Email,
            student.PhoneNumber,
            student.Address
        );

    /// <summary>
    /// Creates a new <see cref="Student"/> entity from an <see cref="IStudentRequest"/>, 
    /// applying string normalization to personal data.
    /// </summary>
    public static Student ToEntity(IStudentRequest request)
        => new Student()
        {
            CNP = request.Cnp,
            FirstName = Normalize(request.FirstName),
            LastName = Normalize(request.LastName),
            DateOfBirth = request.DateOfBirth,
            Email = NormalizeEmail(request.Email),
            PhoneNumber = request.PhoneNumber,
            Address = request.Address,
            StudentCode = string.Empty
        };

    /// <summary>
    /// Updates an existing <see cref="Student"/> entity with values from an <see cref="IStudentRequest"/>.
    /// </summary>
    public static void ApplyRequest(Student student, IStudentRequest request)
    {
        student.CNP = request.Cnp;
        student.FirstName = Normalize(request.FirstName);
        student.LastName = Normalize(request.LastName);
        student.DateOfBirth = request.DateOfBirth;
        student.Email = NormalizeEmail(request.Email);
        student.PhoneNumber = request.PhoneNumber;

        student.Address.Address1 = Normalize(request.Address.Address1);
        student.Address.Address2 = NormalizeOptional(request.Address.Address2);
        student.Address.City = Normalize(request.Address.City);
        student.Address.County = NormalizeOptional(request.Address.County);
        student.Address.Country = Normalize(request.Address.Country);
        student.Address.PostalCode = NormalizeOptional(request.Address.PostalCode);
    }
}