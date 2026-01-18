using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Features.Courses.UnassignProfessor;

/// <summary>
/// Handles unassigning a professor from a course.
/// Supports professor identification by both numeric ID and professor code.
/// Professors are restricted from unassigning themselves if the course has active enrollments.
/// Admins can unassign professors regardless of enrollment status.
/// </summary>
public class UnassignProfessorHandler(
    ApplicationDbContext context,
    ICurrentUserService currentUserService
) : IHandler
{
    public async Task<IResult> HandleAsync(int courseId, string professorIdentifier)
    {
        var course = await context.Courses.Where(c => c.Id == courseId).FirstOrDefaultAsync();

        if (course is null)
        {
            return Results.NotFound(Problems.NotFound("Course not found."));
        }

        // Check if the current user is a professor (not an admin)
        var isUserProfessor = currentUserService.ProfessorCode() is not null;

        if (isUserProfessor)
        {
            // Professors cannot unassign themselves from courses with active enrollments
            var enrollmentsCount = context.Enrollments.Count(e => e.CourseId == courseId);

            if (enrollmentsCount > 0)
            {
                return Results.Conflict(
                    Problems.Conflict(
                        "This course cannot be unassigned because it has active enrollments."
                    )
                );
            }
        }

        // Try to parse identifier as numeric ID first
        var isIdentifierNumeric = int.TryParse(professorIdentifier, out var professorId);

        // Validate the professor is assigned to this course
        if (isIdentifierNumeric && course.ProfessorId != professorId)
        {
            return Results.Conflict(Problems.Conflict("Professor is not assigned to this course."));
        }

        if (!isIdentifierNumeric)
        {
            // Query by professor code
            var professor = await context
                .Professors.AsNoTracking()
                .FirstOrDefaultAsync(p => p.ProfessorCode == professorIdentifier);

            if (course.ProfessorId != professor?.Id)
            {
                return Results.Conflict(
                    Problems.Conflict("Professor is not assigned to this course.")
                );
            }
        }

        course.ProfessorId = null;

        await context.SaveChangesAsync();

        return Results.NoContent();
    }
}
