using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Domain.Entities;
using StudentEnrollment.Shared.Domain.ValueObjects;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Students.Create;

public class CreateStudentHandler(
    ApplicationDbContext context
) : IHandler
{
    public async Task<IResult> HandleAsync(CreateStudentRequest request)
    {
        bool studentExists = await context.Students
            .AsNoTracking()
            .AnyAsync(s => s.Email == request.Email || s.CNP == request.Cnp);

        if (studentExists)
        {
            return Results.Conflict(Problems.Conflict("A student with the same email or CNP already exists."));
        }

        var student = new Student()
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PhoneNumber = request.PhoneNumber,
            Address = Address.FromRequest(request.Address),
            DateOfBirth = request.DateOfBirth,
            CNP = request.Cnp
        };
            
        if (request.UserId is not null)
        {
            var user = await context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.Id == request.UserId);

            if (user is null)
            {
                return Results.NotFound(Problems.NotFound("The user does not exist."));
            }

            if (user.Email != request.Email)
            {
                return Results.BadRequest(Problems.BadRequest("The user's email does not match the student's email."));
            }
            
            student.UserId = request.UserId;
        }
        
        await context.Students.AddAsync(student);
        await context.SaveChangesAsync();
        
        return Results.Created($"students/{student.Id}", student);
    }
}