using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Courses.AssignProfessor;

/// <summary>
/// Handles assigning a professor to a course.
/// Supports professor identification by both numeric ID and professor code.
/// Ensures the course exists and has no professor currently assigned before proceeding.
/// </summary>
public class AssignProfessorHandler(ApplicationDbContext context) : IHandler
{
    public async Task<IResult> HandleAsync(int courseId, string professorIdentifier)
    {
        var course = await context.Courses.Where(c => c.Id == courseId).FirstOrDefaultAsync();

        if (course is null)
        {
            return Results.NotFound(Problems.NotFound("Course not found"));
        }

        if (course.ProfessorId.HasValue)
        {
            return Results.Conflict(
                Problems.Conflict("Another professor is already assigned to this course.")
            );
        }

        // Try to parse identifier as numeric ID first
        var isIdentifierNumeric = int.TryParse(professorIdentifier, out var professorId);

        var professors = context.Professors.AsNoTracking();

        // Query by ID or by professor code based on identifier format
        var professor = isIdentifierNumeric
            ? await professors
                .Where(p => p.Id == professorId)
                .Select(p => new { p.Id })
                .FirstOrDefaultAsync()
            : await professors
                .Where(p => p.ProfessorCode == professorIdentifier)
                .Select(p => new { p.Id })
                .FirstOrDefaultAsync();

        if (professor is null)
        {
            return Results.NotFound(Problems.NotFound("Professor not found."));
        }

        course.ProfessorId = professor.Id;

        await context.SaveChangesAsync();

        return Results.Ok();
    }
}
