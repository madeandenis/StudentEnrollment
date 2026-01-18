using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Courses.UnassignProfessor;

public class UnassignProfessorHandler(ApplicationDbContext context) : IHandler
{
    public async Task<IResult> HandleAsync(int courseId, int professorId)
    {
        var course = await context
            .Courses.Where(c => c.Id == courseId)
            .FirstOrDefaultAsync();

        if (course is null)
        {
            return Results.NotFound(Problems.NotFound("Course not found."));     
        }

        if (course.ProfessorId != professorId)
        {
            return Results.Conflict(Problems.Conflict("Professor is not assigned to this course."));
        }
        
        course.ProfessorId = null;

        await context.SaveChangesAsync();
        
        return Results.NoContent();
    }
}