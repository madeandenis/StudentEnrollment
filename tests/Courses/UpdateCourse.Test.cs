using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Courses.Update;
using StudentEnrollment.Shared.Domain.Entities;
using tests.Common;
using tests.Students;
using Xunit.Abstractions;

namespace tests.Courses;

public class UpdateCourseTest : BaseHandlerTest
{
    private readonly ITestOutputHelper _output;
    private readonly UpdateCourseHandler _sut;

    public UpdateCourseTest(ITestOutputHelper output)
    {
        _output = output;
        var validator = new UpdateCourseValidator();
        _sut = new UpdateCourseHandler(validator, _context);
    }

    [Fact]
    public async Task UpdateCourse_ThrowsValidationError_WhenInvalid()
    {
        var course = new Course
        {
            Name = "Test Course",
            CourseCode = "CS-101",
            Description = "Test Course Description",
            Credits = 1,
            MaxEnrollment = 100
        };
        
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        
        var request = new UpdateCourseRequest(
            new string('d', 501),
            new string('d', 21),
            new string('d', 501),
            11,
            10000
        );

        var result = await _sut.HandleAsync(course.Id, request);

        var validationProblemDetails = result.AssertValidationFailed();
        
        var errors = JsonSerializer.Serialize(validationProblemDetails.Errors, new JsonSerializerOptions
        {
            WriteIndented = true
        });
        
        _output.WriteLine(errors);
    }
    
    [Fact]
    public async Task UpdateCourse_ReturnsNotFound_WhenCourseDoesNotExist()
    {
        var request = new UpdateCourseRequest(
            "Test Course",
            "CS-101",
            "Test Course Description",
            1,
            100
        );

        var result = await _sut.HandleAsync(1, request);

        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task UpdateCourse_Succeeds_WhenRequestIsValid()
    {
        var course = new Course
        {
            Name = "Test Course",
            CourseCode = "CS-101",
            Description = "Test Course Description",
            Credits = 1,
            MaxEnrollment = 100
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var request = new UpdateCourseRequest(
            "Test Course Updated",
            course.CourseCode,
            course.Description,
            course.Credits,
            1
        );

        var result = await _sut.HandleAsync(course.Id, request);
        
        result.AssertOk();
        
        var updatedCourse = await _context.Courses.FindAsync(course.Id);
    
        Assert.NotNull(updatedCourse);
        Assert.Equal(request.Name, updatedCourse.Name);
        Assert.Equal(request.CourseCode, updatedCourse.CourseCode);
        Assert.Equal(request.Description, updatedCourse.Description);
        Assert.Equal(request.Credits, updatedCourse.Credits);
        Assert.Equal(request.MaxEnrollment, updatedCourse.MaxEnrollment);
    }
    
    [Fact]
    public async Task UpdateCourse_ThrowsConflict_WhenCourseCodeAlreadyExists()
    {
        var course1 = new Course
        {
            Name = "Course1",
            CourseCode = "CS-1",
            Description = "Test Course Description",
            Credits = 1,
            MaxEnrollment = 100
        };

        var course2 = new Course
        {
            Name = "Course2",
            CourseCode = "CS-2",
            Description = "Test Course Description",
            Credits = 1,
            MaxEnrollment = 100
        };
        
        _context.Courses.Add(course1);
        _context.Courses.Add(course2);
        await _context.SaveChangesAsync();
        
        var request = new UpdateCourseRequest(
            "Course1",
            course1.CourseCode,
            "Test Course Description",
            1,
            100
        );
        
        var result = await _sut.HandleAsync(course2.Id, request);
        
        result.AssertConflict<ProblemDetails>();
    }
    
    [Fact]
    public async Task UpdateCourse_ThrowsConflict_WhenMaxEnrollmentLessThanCurrentEnrollment()
    {
        var course = new Course
        {
            Name = "Test Course",
            CourseCode = "CS-101",
            Description = "Test Course Description",
            Credits = 1,
            MaxEnrollment = 100
        };
        
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();
        
        var students = new[]
        {
            StudentBuilder.Default(1),
            StudentBuilder.Default(2),
            StudentBuilder.Default(3)
        };

        _context.Students.AddRange(students);
        await _context.SaveChangesAsync();

        var enrollments = new List<Enrollment>
        {
            new() { CourseId = course.Id, StudentId = 1 },
            new() { CourseId = course.Id, StudentId = 2 },
            new() { CourseId = course.Id, StudentId = 3 }
        };
        _context.Enrollments.AddRange(enrollments);
        await _context.SaveChangesAsync();
        
        var request = new UpdateCourseRequest(
            course.Name,
            course.CourseCode,
            course.Description,
            3,
            2 
        );

        var result = await _sut.HandleAsync(course.Id, request);

        result.AssertConflict<ProblemDetails>(); 
    }
}