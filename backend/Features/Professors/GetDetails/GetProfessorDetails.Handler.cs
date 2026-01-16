using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Professors.Common.Mappers;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Professors.GetDetails;

public class GetProfessorDetailsHandler(ApplicationDbContext context) : IHandler
{
    public async Task<IResult> HandleAsync(string professorIdentifier)
    {
        var isNumeric = int.TryParse(professorIdentifier, out var professorId);

        var query = context.Professors.AsNoTracking();

        query = isNumeric
            ? query.Where(p => p.Id == professorId)
            : query.Where(p => p.ProfessorCode == professorIdentifier);

        var professor = await query
            .Select(ProfessorMapper.ProjectToResponse())
            .FirstOrDefaultAsync();

        if (professor is null)
        {
            return Results.NotFound(Problems.NotFound("Professor not found."));
        }

        return Results.Ok(professor);
    }
}
