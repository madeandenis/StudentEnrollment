using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Students.Common.Mappers;
using StudentEnrollment.Shared.Persistence;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace StudentEnrollment.Features.Students.Update;

/// <summary>
/// Handles the creation of a new student record.
/// Performs validation, checks for existing CNP/Email duplicates, and maps the request to a persisted entity.
/// </summary>
public class UpdateStudentHandler(
    UpdateStudentValidator validator,
    ApplicationDbContext context
)
{
    public async Task<IResult> HandleAsync(int studentId, UpdateStudentRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }

        var student = await context.Students.FindAsync(studentId);

        if (student is null)
        {
           return Results.NotFound(Problems.NotFound("Student not found."));     
        }

        var otherStudentExists = await context.Students.AnyAsync(s =>
            student.Id != studentId &&
            (s.Email == NormalizeEmail(request.Email) || s.CNP == request.Cnp)
        );

        if (otherStudentExists)
        {
            return Results.Conflict(Problems.Conflict("A student with the same email or CNP already exists."));
        }
        
        StudentMapper.ApplyRequest(student, request);
        
        await context.SaveChangesAsync();
        
        return Results.Ok();
    }   
}