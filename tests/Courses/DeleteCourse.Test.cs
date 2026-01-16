using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Courses.Delete;
using StudentEnrollment.Shared.Domain.Entities;
using tests.Common;
using tests.Students;

namespace tests.Courses;

public class DeleteCourseTest : BaseHandlerTest
{
    private readonly DeleteCourseHandler _sut;

    public DeleteCourseTest()
    {
        _sut = new DeleteCourseHandler(_context);
    }

    [Fact]
    public async Task DeleteCourse_Succeeds_WhenCourseExistsAndHasNoEnrollments()
    {
        var course = CourseBuilder.Default();

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(course.Id);

        result.AssertNoContent();
    }

    [Fact]
    public async Task DeleteCourse_ReturnsNotFound_WhenCourseDoesNotExist()
    {
        var result = await _sut.HandleAsync(1);

        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task DeleteCourse_ThrowsConflict_WhenCourseHasEnrolledStudents()
    {
        var course = CourseBuilder.Default();

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var students = new[]
        {
            StudentBuilder.Default(1),
            StudentBuilder.Default(2),
            StudentBuilder.Default(3),
        };

        _context.Students.AddRange(students);
        await _context.SaveChangesAsync();

        var enrollments = new List<Enrollment>
        {
            new() { CourseId = course.Id, StudentId = 1 },
            new() { CourseId = course.Id, StudentId = 2 },
            new() { CourseId = course.Id, StudentId = 3 },
        };
        _context.Enrollments.AddRange(enrollments);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(course.Id);

        result.AssertConflict<ProblemDetails>();
    }
}
