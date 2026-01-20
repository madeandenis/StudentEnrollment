using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Professors.GetProfessorAssignedCourses;

public class AssignedCoursesHandler(ApplicationDbContext context) : IHandler
{
    /// <summary>
    /// Retrieves assigned courses for a professor identified by either professor ID or professor code.
    /// </summary>
    /// <param name="professorIdentifier">Either a numeric professor ID or a professor code string</param>
    public async Task<IResult> HandleAsync(string professorIdentifier)
    {
        var isNumeric = int.TryParse(professorIdentifier, out var professorId);

        var query = context.Professors.AsQueryable();

        query = isNumeric
            ? query.Where(p => p.Id == professorId)
            : query.Where(p => p.ProfessorCode == professorIdentifier);

        var assignedCourses = await query
            .Select(p =>
                p.Courses.Select(c => new AssignedCourseResponse(
                        c.Id,
                        c.CourseCode,
                        c.Name,
                        c.Credits,
                        c.MaxEnrollment,
                        c.Enrollments.Count,
                        c.MaxEnrollment - c.Enrollments.Count,
                        c.MaxEnrollment - c.Enrollments.Count > 0,
                        c.CreatedAt
                    ))
                    .ToList()
            )
            .FirstOrDefaultAsync();

        if (assignedCourses is null)
        {
            return Results.NotFound(Problems.NotFound("Professor not found."));
        }

        var teachingLoad = new ProfessorAssignmentResponse(
            assignedCourses,
            assignedCourses.Count,
            assignedCourses.Sum(c => c.EnrolledStudents)
        );

        return Results.Ok(teachingLoad);
    }
}
