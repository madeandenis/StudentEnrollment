using System.Linq.Expressions;
using StudentEnrollment.Features.Professors.Common.Interfaces;
using StudentEnrollment.Features.Professors.Common.Responses;
using StudentEnrollment.Features.Professors.Create;
using StudentEnrollment.Shared.Domain.Entities;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace StudentEnrollment.Features.Professors.Common.Mappers;

public static class ProfessorMapper
{
    public static Professor ToEntity(IProfessorRequest request) =>
        new()
        {
            UserId = request.UserId,
            FirstName = Normalize(request.FirstName),
            LastName = Normalize(request.LastName),
            Email = NormalizeEmail(request.Email),
            PhoneNumber = request.PhoneNumber,
            Address = request.Address,
            ProfessorCode = string.Empty,
        };

    public static CreateProfessorResponse ToResponse(Professor professor) =>
        new(
            professor.Id,
            professor.ProfessorCode,
            professor.UserId,
            professor.FirstName,
            professor.LastName,
            professor.Email,
            professor.PhoneNumber,
            professor.Address
        );

    /// <summary>
    /// Provides a projection expression for converting a <see cref="Professor"/> entity
    /// directly into a <see cref="ProfessorResponse"/> at the database level.
    /// </summary>
    public static Expression<Func<Professor, ProfessorResponse>> ProjectToResponse() =>
        professor => new ProfessorResponse
        {
            Id = professor.Id,
            ProfessorCode = professor.ProfessorCode,
            UserId = professor.UserId,
            FullName = $"{professor.FirstName} {professor.LastName}",
            Email = professor.Email,
            PhoneNumber = professor.PhoneNumber,
            Address = professor.Address,
            CreatedAt = professor.CreatedAt,
        };

    /// <summary>
    /// Updates an existing <see cref="Professor"/> entity with values from an <see cref="IProfessorRequest"/>.
    /// </summary>
    public static void ApplyRequest(Professor professor, IProfessorRequest request)
    {
        professor.UserId = request.UserId;
        professor.FirstName = Normalize(request.FirstName);
        professor.LastName = Normalize(request.LastName);
        professor.Email = NormalizeEmail(request.Email);
        professor.PhoneNumber = request.PhoneNumber;

        professor.Address.Address1 = Normalize(request.Address.Address1);
        professor.Address.Address2 = NormalizeOptional(request.Address.Address2);
        professor.Address.City = Normalize(request.Address.City);
        professor.Address.County = NormalizeOptional(request.Address.County);
        professor.Address.Country = Normalize(request.Address.Country);
        professor.Address.PostalCode = NormalizeOptional(request.Address.PostalCode);
    }
}
