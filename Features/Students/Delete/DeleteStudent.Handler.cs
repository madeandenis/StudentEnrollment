using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Students.Delete;

/// <summary>
/// Handles the removal of a student record.
/// </summary>
/// <remarks>
/// As the <see cref="Student"/> entity implements <see cref="ISoftDeletableEntity"/>, 
/// the configured Interceptor will intercept the deletion and perform a Soft Delete 
/// instead of a physical row removal.
/// </remarks>
public class DeleteStudentHandler(ApplicationDbContext context) : IHandler
{
    public async Task<IResult> HandleAsync(int studentId)
    {
        var student = await context.Students.FindAsync(studentId);

        if (student is null)
        {
            return Results.NotFound(Problems.NotFound("Student not found."));     
        }

        // triggers the SoftDeletableEntityInterceptor
        context.Remove(student);
        
        await context.SaveChangesAsync();
        
        return Results.NoContent();
    }
}