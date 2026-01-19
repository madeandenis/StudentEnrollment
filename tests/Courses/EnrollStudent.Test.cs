using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Courses.EnrollStudent;
using StudentEnrollment.Shared.Domain.Entities;
using tests.Common;
using tests.Students;

namespace tests.Courses;

public class EnrollStudentTest : BaseHandlerTest
{
    private readonly EnrollStudentHandler _sut;

    public EnrollStudentTest()
    {
        _sut = new EnrollStudentHandler(_context);
    }

    [Fact]
    public async Task EnrollStudent_Succeeds_WhenValid()
    {
        var course = CourseBuilder.Default();
        var student = StudentBuilder.Default();

        _context.Courses.Add(course);
        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(student.Id, course.Id);

        result.AssertOk();

        var enrollment = _context.Enrollments.SingleOrDefault(e =>
            e.StudentId == student.Id && e.CourseId == course.Id
        );

        Assert.NotNull(enrollment);
    }

    [Theory]
    [InlineData(2, 1)]
    [InlineData(1, 2)]
    public async Task EnrollStudent_ReturnsNotFound_WhenCourseOrStudentDoesNotExist(
        int studentId,
        int courseId
    )
    {
        var course = CourseBuilder.Default(id: 1);
        var student = StudentBuilder.Default(1);

        _context.Courses.Add(course);
        _context.Students.Add(student);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(studentId, courseId);
        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task EnrollStudent_ReturnsConflict_WhenStudentIsAlreadyEnrolled()
    {
        var course = CourseBuilder.Default();
        var student = StudentBuilder.Default();

        _context.Courses.Add(course);
        _context.Students.Add(student);
        _context.Enrollments.Add(new Enrollment { CourseId = course.Id, StudentId = student.Id });
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(student.Id, course.Id);

        result.AssertConflict<ProblemDetails>();
    }

    [Fact]
    public async Task EnrollStudent_ReturnsConflict_WhenCourseIsFull()
    {
        var course = CourseBuilder.Default(maxEnrollment: 1);

        _context.Courses.Add(course);

        _context.Students.AddRange(
            StudentBuilder.Default(1),
            StudentBuilder.Default(2)
        );

        _context.Enrollments.Add(new Enrollment { CourseId = course.Id, StudentId = 1 });
        
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(course.Id, 2);

        result.AssertConflict<ProblemDetails>();
    }
}
