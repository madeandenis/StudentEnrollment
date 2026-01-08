using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Students.GetStudentEnrolledCourses;

public class EnrolledCoursesHandler(
    ApplicationDbContext context
) : IHandler
{
    public async Task<IResult> HandleAsync(int studentId)
    {
        var enrolledCourses = await context.Students
            .Where(s => s.Id == studentId)
            .Select(s => s.Enrollments.Select(e => new EnrolledCourseResponse(
                e.Course.CourseCode,
                e.Course.Name,
                e.Course.Credits,
                e.CreatedAt
            )).ToList())
            .FirstOrDefaultAsync();

        if (enrolledCourses is null)
        {
            return Results.NotFound(Problems.NotFound("Student not found."));
        }
        
        var academicSituation = new AcademicSituationResponse(
            enrolledCourses,
            enrolledCourses.Sum(c => c.Credits)
        );

        return Results.Ok(academicSituation);
    }
}