using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Professors.Common.Mappers;
using StudentEnrollment.Shared.Persistence;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace StudentEnrollment.Features.Professors.Update;

public class UpdateProfessorHandler(
    UpdateProfessorValidator validator,
    ApplicationDbContext context
) : IHandler
{
    public async Task<IResult> HandleAsync(int professorId, UpdateProfessorRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }

        var professor = await context.Professors.FindAsync(professorId);

        if (professor is null)
        {
            return Results.NotFound(Problems.NotFound("Professor not found."));
        }
        
        var normalizedRequestEmail = NormalizeEmail(request.Email);

        var otherProfessorExists = await context.Professors.AnyAsync(p =>
            p.Id != professorId && 
            (p.Email == normalizedRequestEmail || p.UserId == request.UserId)
        );

        if (otherProfessorExists)
        {
            return Results.Conflict(Problems.Conflict("A professor with the same email or user ID already exists."));
        }

        var userExists = await context.Users.AnyAsync(u => u.Id == request.UserId);

        if (!userExists)
        {
            return Results.NotFound(Problems.NotFound("The user does not exist."));
        }

        ProfessorMapper.ApplyRequest(professor, request);
        await context.SaveChangesAsync();

        return Results.Ok();
    }
}
