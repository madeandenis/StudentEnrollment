using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Students.Common.Mappers;
using StudentEnrollment.Shared.Persistence;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace StudentEnrollment.Features.Students.Create;

/// <summary>
/// Handles the creation of a new student record.
/// Performs validation, checks for existing CNP/Email duplicates, and maps the request to a persisted entity.
/// </summary>
public class CreateStudentHandler(
    ApplicationDbContext context,
    CreateStudentValidator validator
) : IHandler
{
    public async Task<IResult> HandleAsync(CreateStudentRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());
        
        bool studentExists = await context.Students
            .AsNoTracking()
            .AnyAsync(s => s.Email == NormalizeEmail(request.Email) || s.CNP == request.Cnp);

        if (studentExists)
        {
            return Results.Conflict(Problems.Conflict("A student with the same email or CNP already exists."));
        }

        var student = StudentMapper.ToEntity(request);
            
        context.Students.Add(student);
        await context.SaveChangesAsync();

        var response = StudentMapper.ToCreateResponse(student);
        
        return Results.Created($"students/{student.Id}", response);
    }
}