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
        var course = await context.Courses
            .Include(c => c.Enrollments)
            .FirstOrDefaultAsync(c => c.Id == courseId);

        if (course is null)
        {
            return Results.NotFound(Problems.NotFound("Course not found."));     
        }

        if (course.Enrollments.Any())
        {
            return Results.Conflict(Problems.Conflict(
                "This course cannot be deleted because it has active enrollments.")
            );
        }
        
        context.Courses.Remove(course);
        
        await context.SaveChangesAsync();
        
        return Results.NoContent();
    }
}