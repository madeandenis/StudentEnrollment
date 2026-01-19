using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Courses.AssignGrade;
using StudentEnrollment.Shared.Domain.Entities;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using tests.Common;
using tests.Professors;
using tests.Students;

namespace tests.Courses;

public class AssignGradeTest : BaseHandlerTest
{
    private readonly AssignGradeHandler _sut;

    public AssignGradeTest()
    {
        var validator = new AssignGradeValidator();
        _sut = new AssignGradeHandler(validator, _context, _currentUserServiceMock.Object);
    }
    
    [Theory]
    [InlineData(0)]
    [InlineData(11)]
    [InlineData(5.555)] 
    public async Task AssignGrade_ReturnsValidationProblem_WhenGradeIsInvalid(decimal invalidGrade)
    {
        var course = CourseBuilder.Default();
        var student = StudentBuilder.Default();
        _context.Courses.Add(course);
        _context.Students.Add(student);

        _context.Enrollments.Add(new Enrollment { CourseId = course.Id, StudentId = student.Id });
        
        await _context.SaveChangesAsync();

        var request = new AssignGradeRequest(invalidGrade);

        var result = await _sut.HandleAsync(course.Id, student.Id, request);

        result.AssertValidationFailed();
    }

    [Fact]
    public async Task AssignGrade_Succeeds_WhenValid_AsAdmin()
    {
        var course = CourseBuilder.Default();
        var student = StudentBuilder.Default();
        _context.Courses.Add(course);
        _context.Students.Add(student);
        
        var enrollment = new Enrollment { CourseId = course.Id, StudentId = student.Id };
        _context.Enrollments.Add(enrollment);

        await _context.SaveChangesAsync();

        // Admin has no ProfessorCode
        _currentUserServiceMock.Setup(x => x.ProfessorCode()).Returns((string?)null);

        var request = new AssignGradeRequest(9.5m);

        var result = await _sut.HandleAsync(course.Id, student.Id, request);

        result.AssertOk();

        var updatedEnrollment = _context.Enrollments
            .Include(e => e.AssignedByProfessor)
            .Single(e => e.StudentId == student.Id && e.CourseId == course.Id);
        
        Assert.Equal(request.Grade, updatedEnrollment.Grade);
        Assert.Null(updatedEnrollment.AssignedByProfessor);
    }

    [Fact]
    public async Task AssignGrade_Succeeds_WhenValid_AsProfessor()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);

        var course = CourseBuilder.Default(professorId: professor.Id);
        var student = StudentBuilder.Default();

        _context.Courses.Add(course);
        _context.Students.Add(student);

        var enrollment = new Enrollment { CourseId = course.Id, StudentId = student.Id };
        _context.Enrollments.Add(enrollment);

        await _context.SaveChangesAsync();

        var request = new AssignGradeRequest(9.51m);

        _currentUserServiceMock.Setup(x => x.ProfessorCode()).Returns(professor.ProfessorCode);

        var result = await _sut.HandleAsync(course.Id, student.Id, request);

        result.AssertOk();

        var updatedEnrollment = _context.Enrollments
            .Include(e => e.AssignedByProfessor)
            .Single(e => e.StudentId == student.Id && e.CourseId == course.Id);
        
        Assert.Equal(request.Grade, updatedEnrollment.Grade);
        Assert.NotNull(updatedEnrollment.AssignedByProfessor);
        Assert.Equal(professor.Id, updatedEnrollment.AssignedByProfessor.Id);
    }

    [Fact]
    public async Task AssignGrade_Succeeds_WhenReassigning()
    {
        var course = CourseBuilder.Default();
        var student = StudentBuilder.Default();
        _context.Courses.Add(course);
        _context.Students.Add(student);

        var enrollment = new Enrollment
        {
            CourseId = course.Id,
            StudentId = student.Id,
            Grade = 9.51m,
        };
        _context.Enrollments.Add(enrollment);

        await _context.SaveChangesAsync();

        var request = new AssignGradeRequest(10.0m);
        _currentUserServiceMock.Setup(x => x.ProfessorCode()).Returns((string?)null);

        var result = await _sut.HandleAsync(course.Id, student.Id, request);

        result.AssertOk();

        var updatedEnrollment = _context.Enrollments
            .Single(e => e.StudentId == student.Id && e.CourseId == course.Id);
        
        Assert.Equal(request.Grade , updatedEnrollment.Grade);
    }

    [Fact]
    public async Task AssignGrade_ReturnsNotFound_WhenEnrollmentDoesNotExist()
    {
        var result = await _sut.HandleAsync(1, 1, new AssignGradeRequest(9.5m));

        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task AssignGrade_ReturnsUnauthorized_WhenProfessorIsNotAssignedToCourse()
    {
        var user1 = new ApplicationUser();
        var user2 = new ApplicationUser();
        _context.Users.Add(user1);
        _context.Users.Add(user2);

        // Professor1 is assigned to the course
        var professor1 = ProfessorBuilder.Default(userId: user1.Id, professorCode: "PROF-1");
        _context.Professors.Add(professor1);

        // Professor2 is not assigned to the course
        var professor2 = ProfessorBuilder.Default(userId: user2.Id, professorCode: "PROF-2");
        _context.Professors.Add(professor2);

        var course = CourseBuilder.Default(professorId: professor1.Id);
        var student = StudentBuilder.Default();

        _context.Courses.Add(course);
        _context.Students.Add(student);
        
        _context.Enrollments.Add(new Enrollment { CourseId = course.Id, StudentId = student.Id });

        await _context.SaveChangesAsync();

        // The current user is Professor2
        _currentUserServiceMock.Setup(x => x.ProfessorCode()).Returns(professor2.ProfessorCode);

        var result = await _sut.HandleAsync(course.Id, student.Id, new AssignGradeRequest(9m));

        result.AssertUnauthorized();
    }
}
