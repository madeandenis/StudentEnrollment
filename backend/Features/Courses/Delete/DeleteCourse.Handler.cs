using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Courses.Delete;

/// <summary>
/// Handles the removal of a course record.
/// Verifies the course exists and ensures no students are currently enrolled before deletion.
/// </summary>
public class DeleteCourseHandler(ApplicationDbContext context) : IHandler
{
    public async Task<IResult> HandleAsync(int courseId)
    {
        var courseExists = await context.Courses
            .AnyAsync(c => c.Id == courseId);

        if (!courseExists)
            return Results.NotFound(Problems.NotFound("Course not found."));

        var hasEnrollments = await context.Enrollments
            .AnyAsync(e => e.CourseId == courseId);

        if (hasEnrollments)
            return Results.Conflict(Problems.Conflict(
                "This course cannot be deleted because it has active enrollments.")
            );

        await context.Courses
            .Where(c => c.Id == courseId)
            .ExecuteDeleteAsync();

        return Results.NoContent();
    }
}