using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Courses.Update;
using StudentEnrollment.Shared.Domain.Entities;
using tests.Common;
using tests.Students;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace tests.Courses;

public class UpdateCourseTest : BaseHandlerTest
{
    private readonly UpdateCourseHandler _sut;

    public UpdateCourseTest()
    {
        var validator = new UpdateCourseValidator();
        _sut = new UpdateCourseHandler(validator, _context);
    }
    
    public UpdateCourseRequest ToUpdateCourseRequest(Course course)
    {
        return new UpdateCourseRequest(
            course.Name,
            course.CourseCode,
            course.Description,
            course.Credits,
            course.MaxEnrollment
        );
    }

    [Theory]
    [MemberData(nameof(CourseInvalidTestData.InvalidNames), MemberType = typeof(CourseInvalidTestData))]
    public async Task UpdateCourse_ThrowsValidationError_WhenNameIsInvalid(string name)
    {
        var course = CourseBuilder.Default();
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        course.Name = name;
        var request = ToUpdateCourseRequest(course);
        var result = await _sut.HandleAsync(course.Id, request);
        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(nameof(CourseInvalidTestData.InvalidCourseCodes), MemberType = typeof(CourseInvalidTestData))]
    public async Task UpdateCourse_ThrowsValidationError_WhenCourseCodeIsInvalid(string courseCode)
    {
        var course = CourseBuilder.Default();
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        course.CourseCode = courseCode;
        var request = ToUpdateCourseRequest(course);
        var result = await _sut.HandleAsync(course.Id, request);
        
        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(nameof(CourseInvalidTestData.InvalidDescriptions), MemberType = typeof(CourseInvalidTestData))]
    public async Task UpdateCourse_ThrowsValidationError_WhenDescriptionIsInvalid(
        string description
    )
    {
        var course = CourseBuilder.Default();
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        course.Description = description;
        var request = ToUpdateCourseRequest(course);
        var result = await _sut.HandleAsync(course.Id, request);
        
        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(nameof(CourseInvalidTestData.InvalidCredits), MemberType = typeof(CourseInvalidTestData))]
    public async Task UpdateCourse_ThrowsValidationError_WhenCreditsAreInvalid(int credits)
    {
        var course = CourseBuilder.Default();
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        course.Credits = credits;
        var request = ToUpdateCourseRequest(course);
        var result = await _sut.HandleAsync(course.Id, request);
        
        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(nameof(CourseInvalidTestData.InvalidMaxEnrollments), MemberType = typeof(CourseInvalidTestData))]
    public async Task UpdateCourse_ThrowsValidationError_WhenMaxEnrollmentIsInvalid(
        int maxEnrollment
    )
    {
        var course = CourseBuilder.Default();
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        course.MaxEnrollment = maxEnrollment;
        var request = ToUpdateCourseRequest(course);
        var result = await _sut.HandleAsync(course.Id, request);
        
        result.AssertValidationFailed();
    }

    [Fact]
    public async Task UpdateCourse_ReturnsNotFound_WhenCourseDoesNotExist()
    {
        var request = ToUpdateCourseRequest(CourseBuilder.Default());

        var result = await _sut.HandleAsync(1, request);

        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task UpdateCourse_Succeeds_WhenRequestIsValid()
    {
        var course = CourseBuilder.Default();
        
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        course.Name = "    Updated Course Name";
        course.CourseCode = "Cs-Updated    "; 
        course.Description = "Updated Course Description";
        course.Credits = 2;
        course.MaxEnrollment = 100;
        
        var request = ToUpdateCourseRequest(course);

        var result = await _sut.HandleAsync(course.Id, request);

        result.AssertOk();

        var updatedCourse = await _context.Courses.FindAsync(course.Id);

        // Data normalization is done in the handler
        Assert.NotNull(updatedCourse);
        Assert.Equal(Normalize(request.Name), updatedCourse.Name);
        Assert.Equal(NormalizeEmail(request.CourseCode), updatedCourse.CourseCode);
        Assert.Equal(Normalize(request.Description), updatedCourse.Description);
        Assert.Equal(request.Credits, updatedCourse.Credits);
        Assert.Equal(request.MaxEnrollment, updatedCourse.MaxEnrollment);
    }

    [Fact]
    public async Task UpdateCourse_ThrowsConflict_WhenCourseCodeAlreadyExists()
    {
        var course1 = CourseBuilder.Default(name: "Course1", courseCode: "CS-1");
        var course2 = CourseBuilder.Default(name: "Course2", courseCode: "CS-2");

        _context.Courses.Add(course1);
        _context.Courses.Add(course2);
        await _context.SaveChangesAsync();

        course2.CourseCode = course1.CourseCode;
        var request = ToUpdateCourseRequest(course2);

        var result = await _sut.HandleAsync(course2.Id, request);

        result.AssertConflict<ProblemDetails>();
    }

    [Fact]
    public async Task UpdateCourse_ThrowsConflict_WhenMaxEnrollmentLessThanCurrentEnrollment()
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

        course.MaxEnrollment = enrollments.Count - 1;

        var request = ToUpdateCourseRequest(course);
        var result = await _sut.HandleAsync(course.Id, request);

        result.AssertConflict<ProblemDetails>();
    }
}
