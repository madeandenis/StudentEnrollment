using StudentEnrollment.Features.Students.Common.Interfaces;
using StudentEnrollment.Features.Students.Create;
using StudentEnrollment.Features.Students.GetDetails;
using StudentEnrollment.Shared.Domain.Entities;
using StudentEnrollment.Shared.Domain.ValueObjects;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace StudentEnrollment.Features.Students.Common.Mappers;

/// <summary>
/// Provides mapping logic to transform between Student entities, requests, and response DTOs.
/// </summary>

public static class StudentMapper
{
    /// <summary>
    /// Maps a <see cref="Student"/> entity to a specific response type that implements <see cref="IStudentResponse"/>.
    /// </summary>
    public static TResponse ToStudentResponse<TResponse>(Student student) 
        where TResponse : IStudentResponse, new()
    {
        return new TResponse
        {
            Id = student.Id,
            StudentCode = student.StudentCode,
            FirstName = student.FirstName,
            LastName = student.LastName,
            Email = student.Email,
            PhoneNumber = student.PhoneNumber,
            DateOfBirth = student.DateOfBirth,
            Address = student.Address
        };
    }
    
    /// <summary>
    /// Creates a new <see cref="Student"/> entity from an <see cref="IStudentRequest"/>, 
    /// applying string normalization to personal data.
    /// </summary>
    public static Student ToEntity(IStudentRequest request)
    {
        return new Student()
        {
            CNP = request.Cnp,
            FirstName = Normalize(request.FirstName),
            LastName = Normalize(request.LastName),
            DateOfBirth = request.DateOfBirth,
            Email = NormalizeEmail(request.Email),
            PhoneNumber = request.PhoneNumber,
            Address = request.Address,
        };
    }
    
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