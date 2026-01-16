using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Professors.Common.Mappers;
using StudentEnrollment.Shared.Persistence;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace StudentEnrollment.Features.Professors.Create;

public class CreateProfessorHandler(
    CreateProfessorValidator validator,
    ApplicationDbContext context
) : IHandler
{
    public async Task<IResult> HandleAsync(CreateProfessorRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());
        
        var normalizedRequestEmail = NormalizeEmail(request.Email);

        var conflictingProfessor = await context.Professors
            .AsNoTracking()
            .Where(p => p.Email == normalizedRequestEmail || p.UserId == request.UserId)
            .Select(p => new { p.Email, p.UserId })
            .FirstOrDefaultAsync();

        if (conflictingProfessor is not null)
        {
            if (conflictingProfessor.Email == normalizedRequestEmail)
            {
                return Results.Conflict(Problems.Conflict("A professor with the same email already exists."));
            }
    
            if (conflictingProfessor.UserId == request.UserId)
            {
                return Results.Conflict(Problems.Conflict("User Id is already assigned to another professor."));
            }
        }
        
        var userExists = await context.Users.AnyAsync(u => u.Id == request.UserId);

        if (!userExists)
        {
            return Results.NotFound(Problems.NotFound("The user does not exist."));
        }
        
        var professor = ProfessorMapper.ToEntity(request);

        context.Professors.Add(professor);
        await context.SaveChangesAsync();
        
        return Results.CreatedAtRoute(
            routeName: "GetProfessorById",
            routeValues: new { id = professor.Id },
            value: ProfessorMapper.ToResponse(professor)
        );
    }
}