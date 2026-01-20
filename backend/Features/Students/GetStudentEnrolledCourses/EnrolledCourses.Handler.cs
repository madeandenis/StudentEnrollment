using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Students.GetStudentEnrolledCourses;

public class EnrolledCoursesHandler(ApplicationDbContext context) : IHandler
{
    /// <summary>
    /// Retrieves enrolled courses for a student identified by either student ID or student code.
    /// </summary>
    /// <param name="studentIdentifier">Either a numeric student ID or a student code string</param>
    public async Task<IResult> HandleAsync(string studentIdentifier)
    {
        var isNumeric = int.TryParse(studentIdentifier, out var studentId);

        var query = context.Students.AsQueryable();

        query = isNumeric
            ? query.Where(s => s.Id == studentId)
            : query.Where(s => s.StudentCode == studentIdentifier);

        var enrolledCourses = await query
            .Select(s =>
                s.Enrollments.Select(e => new EnrolledCourseResponse(
                        e.Course.Id,
                        e.Course.CourseCode,
                        e.Course.Name,
                        e.Course.Credits,
                        e.CreatedAt,
                        e.Grade,
                        e.AssignedByProfessor != null
                            ? $"{e.AssignedByProfessor.FirstName} {e.AssignedByProfessor.LastName}"
                            : null
                    ))
                    .ToList()
            )
            .FirstOrDefaultAsync();
        if (enrolledCourses is null)
        {
            return Results.NotFound(Problems.NotFound("Student not found."));
        }

        var academicSituation = new StudentEnrollmentResponse(
            enrolledCourses,
            enrolledCourses.Sum(c => c.Credits)
        );

        return Results.Ok(academicSituation);
    }
}
