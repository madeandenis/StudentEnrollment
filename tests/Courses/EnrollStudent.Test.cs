using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Courses.Enroll;
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
        var course = new Course
        {
            Name = "Test Course",
            CourseCode = "CS-101",
            Description = "Test Course Description",
            Credits = 1,
            MaxEnrollment = 100
        };
        var student = StudentBuilder.Default();
        
        _context.Courses.Add(course);
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        
        var result = await _sut.HandleAsync(student.Id, course.Id);

        result.AssertOk();
        
        var enrollment = _context.Enrollments.SingleOrDefault(e => e.StudentId == student.Id && e.CourseId == course.Id);
        
        Assert.NotNull(enrollment);
    }

    [Fact]
    public async Task EnrollStudent_ReturnsNotFound_WhenCourseOrStudentDoesNotExist()
    {
        var course = new Course
        {
            Id = 1,
            Name = "Test Course",
            CourseCode = "CS-101",
            Description = "Test Course Description",
            Credits = 1,
            MaxEnrollment = 100
        };
        var student = StudentBuilder.Default(1);
        
        _context.Courses.Add(course);
        _context.Students.Add(student);
        await _context.SaveChangesAsync();
        
        var notFoundCourseResult = await _sut.HandleAsync(2, 1);
        notFoundCourseResult.AssertNotFound<ProblemDetails>();
        
        var notFoundStudentResult = await _sut.HandleAsync(1, 2);   
        notFoundStudentResult.AssertNotFound<ProblemDetails>();
        
        var successResult = await _sut.HandleAsync(1, 1);
        successResult.AssertOk();
    }

    [Fact]
    public async Task EnrollStudent_ReturnsConflict_WhenStudentIsAlreadyEnrolled()
    {
        var course = new Course
        {
            Name = "Test Course",
            CourseCode = "CS-101",
            Description = "Test Course Description",
            Credits = 1,
            MaxEnrollment = 100
        };
        var student = StudentBuilder.Default();

        _context.Courses.Add(course);
        _context.Students.Add(student);
        _context.Enrollments.Add(new Enrollment {CourseId = course.Id, StudentId = student.Id});
        await _context.SaveChangesAsync();
        
        var result = await _sut.HandleAsync(student.Id, course.Id);
        
        result.AssertConflict<ProblemDetails>();
    }

    [Fact]
    public async Task EnrollStudent_ReturnsConflict_WhenCourseIsFull()
    {
        var course = new Course
        {
            Name = "Test Course",
            CourseCode = "CS-101",
            Description = "Test Course Description",
            Credits = 1,
            MaxEnrollment = 1
        };
        
        _context.Courses.Add(course);

        _context.Students.AddRange(
            StudentBuilder.Default(1),
            StudentBuilder.Default(2)
        );
        
        await _context.SaveChangesAsync();
        
        await _sut.HandleAsync(course.Id, 1);
        var result = await _sut.HandleAsync(course.Id, 2);
        
        result.AssertConflict<ProblemDetails>();
    }
}