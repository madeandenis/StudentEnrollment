using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Features.AssignGrade;

public class AssignGradeHandler(
    AssignGradeValidator validator,
    ApplicationDbContext context,
    ICurrentUserService currentUserService
) : IHandler
{
    public async Task<IResult> HandleAsync(int courseId, int studentId, AssignGradeRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
        {
            return Results.ValidationProblem(validationResult.ToDictionary());
        }
        
        var enrollment = await context.Enrollments
            .Include(e => e.Course)
            .Where(e => e.CourseId == courseId && e.StudentId == studentId)
            .FirstOrDefaultAsync();

        if (enrollment is null)
        {
            return Results.NotFound(Problems.NotFound("Enrollment not found."));
        }

        var professorCode = currentUserService.ProfessorCode();

        if (professorCode is not null)
        {
            if (enrollment.Course.ProfessorId != professorCode)
            {
                
            }
            
            var professor = await context.Professors
                .AsNoTracking()
                .Where(p => p.ProfessorCode == professorCode)
                .FirstOrDefaultAsync();

            enrollment.AssignedByProfessor = professor;
        }
        
        enrollment.Grade = request.Grade;
        
        await context.SaveChangesAsync();
        
        return Results.Ok();
    } 
}