using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Professors.Delete;

public class DeleteProfessorHandler(ApplicationDbContext context) : IHandler
{
    public async Task<IResult> HandleAsync(int professorId)
    {
        var professor = await context.Professors.FindAsync(professorId);

        if (professor is null)
        {
            return Results.NotFound(Problems.NotFound("Professor not found."));
        }

        // triggers the SoftDeletableEntityInterceptor
        context.Remove(professor);

        await context.SaveChangesAsync();

        return Results.NoContent();
    }
}
