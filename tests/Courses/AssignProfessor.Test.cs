using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Courses.AssignProfessor;
using StudentEnrollment.Shared.Domain.Entities;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using tests.Common;
using tests.Professors;

namespace tests.Courses;

public class AssignProfessorTest : BaseHandlerTest
{
    private readonly AssignProfessorHandler _sut;

    public AssignProfessorTest()
    {
        _sut = new AssignProfessorHandler(_context);
    }

    [Fact]
    public async Task AssignProfessor_Succeeds_WhenValid()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);

        var course = CourseBuilder.Default(professorId: null);
        _context.Courses.Add(course);
        
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(course.Id, professor.Id);

        result.AssertOk();

        var updatedCourse = await _context.Courses.FindAsync(course.Id);
        Assert.NotNull(updatedCourse);
        Assert.Equal(professor.Id, updatedCourse.ProfessorId);
    }

    [Fact]
    public async Task AssignProfessor_ReturnsNotFound_WhenCourseDoesNotExist()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(999, professor.Id);

        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task AssignProfessor_ReturnsNotFound_WhenProfessorDoesNotExist()
    {
        var course = CourseBuilder.Default(professorId: null);
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(course.Id, 999);

        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task AssignProfessor_ReturnsConflict_WhenProfessorAlreadyAssignedToThisCourse()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);

        var course = CourseBuilder.Default(professorId: professor.Id);
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(course.Id, professor.Id);

        result.AssertConflict<ProblemDetails>();
    }

    [Fact]
    public async Task AssignProfessor_ReturnsConflict_WhenDifferentProfessorIsAlreadyAssigned()
    {
        var user1 = new ApplicationUser();
        var user2 = new ApplicationUser();
        _context.Users.AddRange(user1, user2);
        await _context.SaveChangesAsync();

        var professor1 = ProfessorBuilder.Default(
            userId: user1.Id,
            email: "prof1@test.local",
            professorCode: "PROF-0001"
        );
        var professor2 = ProfessorBuilder.Default(
            userId: user2.Id,
            email: "prof2@test.local",
            professorCode: "PROF-0002"
        );
        _context.Professors.AddRange(professor1, professor2);

        var course = CourseBuilder.Default(professorId: professor1.Id);
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(course.Id, professor2.Id);

        result.AssertConflict<ProblemDetails>();
    }

    [Fact]
    public async Task AssignProfessor_ReturnsNotFound_WhenProfessorIsSoftDeleted()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id, isDeleted: true);
        _context.Professors.Add(professor);

        var course = CourseBuilder.Default(professorId: null);
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(course.Id, professor.Id);

        result.AssertNotFound<ProblemDetails>();
    }
}
