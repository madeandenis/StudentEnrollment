using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Students.Common.Mappers;
using StudentEnrollment.Shared.Persistence;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace StudentEnrollment.Features.Students.Update;

/// <summary>
/// Handles the update of an existing student record.
/// Performs validation, checks for existing CNP/Email duplicates, and updates the student entity.
/// Re-associates the student with a user based on the new email.
/// </summary>
public class UpdateStudentHandler(UpdateStudentValidator validator, ApplicationDbContext context)
    : IHandler
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
            student.Id != studentId
            && (s.Email == NormalizeEmail(request.Email) || s.CNP == request.Cnp)
        );

        if (otherStudentExists)
        {
            return Results.Conflict(
                Problems.Conflict("A student with the same email or CNP already exists.")
            );
        }

        // Re-associate with user based on the new email
        if (student.Email != NormalizeEmail(request.Email))
        {
            var normalizedEmail = NormalizeEmail(request.Email);

            var existingUser = await context
                .Users.AsNoTracking()
                .FirstOrDefaultAsync(u => u.NormalizedEmail == normalizedEmail);

            student.UserId = existingUser?.Id;
        }

        StudentMapper.ApplyRequest(student, request);
        await context.SaveChangesAsync();

        return Results.Ok();
    }
}
