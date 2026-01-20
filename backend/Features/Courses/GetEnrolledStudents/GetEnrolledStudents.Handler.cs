using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Courses.GetEnrolledStudents;

public class GetEnrolledStudentsHandler(ApplicationDbContext context) : IHandler
{
    /// <summary>
    /// Retrieves enrolled students for a course identified by either course ID or course code.
    /// </summary>
    /// <param name="courseIdentifier">Either a numeric course ID or a course code string</param>
    public async Task<IResult> HandleAsync(string courseIdentifier)
    {
        var isNumeric = int.TryParse(courseIdentifier, out var courseId);

        var query = context.Courses.AsQueryable();

        query = isNumeric
            ? query.Where(c => c.Id == courseId)
            : query.Where(c => c.CourseCode == courseIdentifier);

        var enrolledStudents = await query
            .Select(c =>
                c.Enrollments.Select(e => new EnrolledStudentResponse(
                        e.Student.Id,
                        e.Student.StudentCode,
                        $"{e.Student.FirstName} {e.Student.LastName}",
                        e.Student.Email,
                        e.CreatedAt,
                        e.Grade,
                        e.AssignedByProfessor != null
                            ? $"{e.AssignedByProfessor.FirstName} {e.AssignedByProfessor.LastName}"
                            : null
                    ))
                    .ToList()
            )
            .FirstOrDefaultAsync();

        if (enrolledStudents is null)
        {
            return Results.NotFound(Problems.NotFound("Course not found."));
        }

        var response = new CourseEnrolledStudentsResponse(enrolledStudents, enrolledStudents.Count);

        return Results.Ok(response);
    }
}
