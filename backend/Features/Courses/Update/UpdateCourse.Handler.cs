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
public class UpdateCourseHandler(UpdateCourseValidator validator, ApplicationDbContext context)
    : IHandler
{
    public async Task<IResult> HandleAsync(int courseId, UpdateCourseRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }

        var normalizedCode = NormalizeToUpper(request.CourseCode);

        var courseData = await context
            .Courses.Where(c => c.Id == courseId)
            .Select(c => new
            {
                Course = c,
                CodeTaken = context.Courses.Any(x =>
                    x.Id != courseId && x.CourseCode == normalizedCode
                ),
                CurrentEnrollment = context.Enrollments.Count(e => e.CourseId == courseId),
            })
            .FirstOrDefaultAsync();

        if (courseData is null || courseData.Course is null)
        {
            return Results.NotFound(Problems.NotFound("Course not found."));
        }

        if (courseData.CodeTaken)
        {
            return Results.Conflict(
                Problems.Conflict("Another course with the same code already exists.")
            );
        }

        if (request.MaxEnrollment < courseData.CurrentEnrollment)
        {
            return Results.Conflict(
                Problems.Conflict(
                    $"Cannot reduce capacity to {request.MaxEnrollment}. There are currently {courseData.CurrentEnrollment} students enrolled."
                )
            );
        }

        CourseMapper.ApplyRequest(courseData.Course, request);

        await context.SaveChangesAsync();

        return Results.Ok();
    }
}
