using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Courses.Withdraw;

public class WithdrawStudentHandler(
    ApplicationDbContext context    
) : IHandler
{
    public async Task<IResult> HandleAsync(int courseId, int studentId)
    {
        var studentExists = await context.Students
            .AnyAsync(s => s.Id == studentId);
        
        if (!studentExists)
        {
            return Results.NotFound(
                Problems.NotFound($"Student with ID {studentId} not found."));
        }

        var courseExists = await context.Courses
            .AnyAsync(c => c.Id == courseId);
        
        if (!courseExists)
        {
            return Results.NotFound(
                Problems.NotFound($"Course with ID {courseId} not found."));
        }

        var enrollment = await context.Enrollments
            .FirstOrDefaultAsync(e => 
                e.StudentId == studentId && e.CourseId == courseId);

        if (enrollment == null)
        {
            return Results.NotFound(
                Problems.NotFound("No active enrollment found for this student and course."));
        }

        context.Enrollments.Remove(enrollment);
        await context.SaveChangesAsync();

        return Results.NoContent();
    }
}