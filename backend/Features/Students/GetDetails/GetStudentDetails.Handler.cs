using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Students.Common.Mappers;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Students.GetDetails;

public class GetStudentDetailsHandler(ApplicationDbContext context) : IHandler
{
    public async Task<IResult> HandleAsync(string studentIdentifier)
    {
        var isNumeric = int.TryParse(studentIdentifier, out var studentId);

        var query = context.Students.AsNoTracking();

        query = isNumeric
            ? query.Where(s => s.Id == studentId)
            : query.Where(s => s.StudentCode == studentIdentifier);

        var student = await query.Select(StudentMapper.ProjectToResponse()).FirstOrDefaultAsync();

        if (student is null)
        {
            return Results.NotFound(Problems.NotFound("Student not found."));
        }

        return Results.Ok(student);
    }
}
