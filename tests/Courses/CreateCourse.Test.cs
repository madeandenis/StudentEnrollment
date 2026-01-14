using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Courses.Common.Mappers;
using StudentEnrollment.Features.Courses.Common.Responses;
using StudentEnrollment.Features.Courses.Create;
using tests.Common;
using Xunit.Abstractions;

namespace tests.Courses;

public class CreateCourseTest : BaseHandlerTest
{
    private readonly ITestOutputHelper _output;
    private readonly CreateCourseHandler _sut;

    public CreateCourseTest(ITestOutputHelper output)
    {
        _output = output;
        var validator = new CreateCourseValidator();
        _sut = new CreateCourseHandler(validator, _context);
    }
    
    [Fact]
    public async Task CreateCourse_ThrowsValidationError_WhenInvalid()
    {
        var request = new CreateCourseRequest(
            new string('d', 501),
            new string('d', 21),
            new string('d', 501),
            11,
            10000
        );

        var result = await _sut.HandleAsync(request);

        var validationProblemDetails = result.AssertValidationFailed();
        
        var errors = JsonSerializer.Serialize(validationProblemDetails.Errors, new JsonSerializerOptions
        {
            WriteIndented = true
        });
        
        _output.WriteLine(errors);
    }
    
    [Fact]
    public async Task CreateCourse_Succeeds_WhenValid()
    {
        var request = new CreateCourseRequest(
            "Test Course",
            "CS-101",
            "Test Course Description",
            10,
            100
        );

        var result = await _sut.HandleAsync(request);

        result.AssertCreated<CourseResponse>();
    }
    
    [Fact]
    public async Task CreateCourse_ThrowsConflict_WhenCourseCodeExists()
    {
        var request = new CreateCourseRequest(
            "Test Course",
            "CS-101",
            "Test Course Description",
            10,
            100
        );
        
        _context.Courses.Add(CourseMapper.ToEntity(request));
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(request);

        result.AssertConflict<ProblemDetails>();
    }
}