using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Domain.Entities;
using StudentEnrollment.Shared.Persistence;

namespace StudentEnrollment.Features.Courses.Enroll;

public class EnrollStudentHandler(
    ApplicationDbContext context    
) : IHandler
{
    public async Task<IResult> HandleAsync(int courseId, int studentId)
    {
        var validationData = await context.Courses
            .Where(c => c.Id == courseId)
            .Select(c =>
                new
                {
                    AlreadyEnrolled = c.Enrollments.Any(e => e.StudentId == studentId && e.CourseId == courseId),
                    HasRoom = c.Enrollments.Count() < c.MaxEnrollment,
                    StudentExists = context.Students.Any(s => s.Id == studentId)
                }
            )
            .FirstOrDefaultAsync();

        if (validationData == null)
        {
            return Results.NotFound(Problems.NotFound("Course not found"));
        }        
        
        if (!validationData.StudentExists)
        {
            return Results.NotFound(Problems.NotFound("Student not found."));
        }
        
        if (validationData.AlreadyEnrolled)
        {
            return Results.Conflict(Problems.Conflict("Student is already enrolled."));
        }

        if (!validationData.HasRoom)
        {
            return Results.Conflict(Problems.Conflict("Course is full."));
        }

        var enrollment = new Enrollment()
        {
            CourseId = courseId,
            StudentId = studentId
        };
        
        context.Enrollments.Add(enrollment);
        await context.SaveChangesAsync();
        
        return Results.Created();
    } 
}