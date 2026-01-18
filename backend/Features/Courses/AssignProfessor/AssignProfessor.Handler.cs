using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Courses.AssignProfessor;

public class AssignProfessorHandler(ApplicationDbContext context) : IHandler
{
    public async Task<IResult> HandleAsync(int courseId, int professorId)
    {
        var validationData = await context
            .Courses.Where(c => c.Id == courseId)
            .Select(c => new
            {
                Course = c,
                AlreadyAssigned = c.ProfessorId.HasValue,
                ProfessorExists = context.Professors.Any(p => p.Id == professorId)
            })
            .FirstOrDefaultAsync();

        if (validationData is null)
        {
            return Results.NotFound(Problems.NotFound("Course not found"));
        }

        if (!validationData.ProfessorExists)
        {
            return Results.NotFound(Problems.NotFound("Professor not found.")); 
        }

        if (validationData.AlreadyAssigned)
        {
            return Results.Conflict(Problems.Conflict("Another professor is already assigned to this course."));
        }
        
        validationData.Course.ProfessorId = professorId;
        
        await context.SaveChangesAsync();
        
        return Results.Ok();
    }
}