using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Courses.Common.Mappers;
using StudentEnrollment.Shared.Persistence;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace StudentEnrollment.Features.Courses.Update;

/// <summary>
/// Handles the update of an existing course record.
/// Validates the request, ensures the new CourseCode is unique (excluding the current record), and applies changes.
/// </summary>
public class UpdateCourseHandler(
    UpdateCourseValidator validator,
    ApplicationDbContext context
) : IHandler
{
    public async Task<IResult> HandleAsync(int courseId, UpdateCourseRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }

        var course = await context.Courses.FindAsync(courseId);
        if (course is null)
        {
            return Results.NotFound(Problems.NotFound("Course not found."));
        }

        var normalizedCode = NormalizeToUpper(request.CourseCode);

        var isCodeTaken = await context.Courses.AnyAsync(c => 
            c.Id != courseId && c.CourseCode == normalizedCode
        );

        if (isCodeTaken)
        {
            return Results.Conflict(Problems.Conflict("Another course with the same code already exists."));
        }

        CourseMapper.ApplyRequest(course, request);
        
        await context.SaveChangesAsync();
        
        return Results.Ok();
    }
}