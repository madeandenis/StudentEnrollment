using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Courses.Common.Mappers;
using StudentEnrollment.Features.Courses.Common.Responses;
using StudentEnrollment.Features.Courses.Create;
using StudentEnrollment.Shared.Domain.Entities;
using tests.Common;

namespace tests.Courses;

public class CreateCourseTest : BaseHandlerTest
{
    private readonly CreateCourseHandler _sut;

    public CreateCourseTest()
    {
        var validator = new CreateCourseValidator();
        _sut = new CreateCourseHandler(validator, _context);
    }
    
    private static CreateCourseRequest ToCreateCourseRequest(Course course)
    {
        return new CreateCourseRequest(
            course.Name,
            course.CourseCode,
            course.Description,
            course.Credits,
            course.MaxEnrollment
        );
    }

    [Theory]
    [MemberData(nameof(CourseInvalidTestData.InvalidNames), MemberType = typeof(CourseInvalidTestData))]
    public async Task CreateCourse_ThrowsValidationError_WhenNameIsInvalid(string name)
    {
        var course = CourseBuilder.Default(name: name);
        var request = ToCreateCourseRequest(course);

        var result = await _sut.HandleAsync(request);

        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(nameof(CourseInvalidTestData.InvalidCourseCodes), MemberType = typeof(CourseInvalidTestData))]
    public async Task CreateCourse_ThrowsValidationError_WhenCourseCodeIsInvalid(string courseCode)
    {
        var course = CourseBuilder.Default(courseCode: courseCode);
        var request = ToCreateCourseRequest(course);
        
        var result = await _sut.HandleAsync(request);
        
        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(nameof(CourseInvalidTestData.InvalidDescriptions), MemberType = typeof(CourseInvalidTestData))]
    public async Task CreateCourse_ThrowsValidationError_WhenDescriptionIsInvalid(
        string description
    )
    {
        var course = CourseBuilder.Default(description: description);
        var request = ToCreateCourseRequest(course);

        var result = await _sut.HandleAsync(request);
        
        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(nameof(CourseInvalidTestData.InvalidCredits), MemberType = typeof(CourseInvalidTestData))]
    public async Task CreateCourse_ThrowsValidationError_WhenCreditsAreInvalid(int credits)
    {
        var course = CourseBuilder.Default(credits: credits);
        var request = ToCreateCourseRequest(course);

        
        var result = await _sut.HandleAsync(request);
        
        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(nameof(CourseInvalidTestData.InvalidMaxEnrollments), MemberType = typeof(CourseInvalidTestData))]
    public async Task CreateCourse_ThrowsValidationError_WhenMaxEnrollmentIsInvalid(
        int maxEnrollment
    )
    {
        var course = CourseBuilder.Default(maxEnrollment: maxEnrollment);
        var request = ToCreateCourseRequest(course);
        
        var result = await _sut.HandleAsync(request);
        
        result.AssertValidationFailed();
    }

    [Fact]
    public async Task CreateCourse_Succeeds_WhenValid()
    {
        var course = CourseBuilder.Default();
        var request = ToCreateCourseRequest(course);

        var result = await _sut.HandleAsync(request);

        result.AssertCreated<CourseResponse>();
    }

    [Fact]
    public async Task CreateCourse_ThrowsConflict_WhenCourseExists()
    {
        var course = CourseBuilder.Default();
        var request = ToCreateCourseRequest(course);
        
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(request);

        result.AssertConflict<ProblemDetails>();
    }
}