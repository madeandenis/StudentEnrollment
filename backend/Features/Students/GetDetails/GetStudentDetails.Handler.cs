using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Students.Common.Mappers;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Students.GetDetails;

public class GetStudentDetailsHandler(ApplicationDbContext context) : IHandler 
{
    public async Task<IResult> HandleAsync(int studentId)
    {
        var student = await context.Students
            .AsNoTracking()
            .Select(StudentMapper.ProjectToResponse())
            .FirstOrDefaultAsync(s => s.Id == studentId);

        if (student is null)
        {
            return Results.NotFound(Problems.NotFound("Student not found."));
        }

        return Results.Ok(student);
    }   
}