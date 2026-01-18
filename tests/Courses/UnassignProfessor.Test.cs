using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Courses.UnassignProfessor;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using tests.Common;
using tests.Professors;

namespace tests.Courses;

public class UnassignProfessorTest : BaseHandlerTest
{
    private readonly UnassignProfessorHandler _sut;

    public UnassignProfessorTest()
    {
        _sut = new UnassignProfessorHandler(_context, _currentUserServiceMock.Object);
    }

    [Fact]
    public async Task UnassignProfessor_Succeeds_WhenValid()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);

        var course = CourseBuilder.Default(professorId: professor.Id);
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(course.Id, professor.Id.ToString());

        result.AssertNoContent();

        var updatedCourse = await _context.Courses.FindAsync(course.Id);
        Assert.NotNull(updatedCourse);
        Assert.Null(updatedCourse.ProfessorId);
    }

    [Fact]
    public async Task UnassignProfessor_ReturnsNotFound_WhenCourseDoesNotExist()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(999, professor.Id.ToString());

        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task UnassignProfessor_ReturnsConflict_WhenProfessorIsNotAssignedToThisCourse()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);

        var course = CourseBuilder.Default(professorId: null);
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(course.Id, professor.Id.ToString());

        result.AssertConflict<ProblemDetails>();
    }

    [Fact]
    public async Task UnassignProfessor_ReturnsConflict_WhenDifferentProfessorIsAssigned()
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

        var result = await _sut.HandleAsync(course.Id, professor2.Id.ToString());

        result.AssertConflict<ProblemDetails>();
    }

    [Fact]
    public async Task UnassignProfessor_Succeeds_EvenWhenProfessorIsSoftDeleted()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id, isDeleted: true);
        _context.Professors.Add(professor);

        var course = CourseBuilder.Default(professorId: professor.Id);
        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(course.Id, professor.Id.ToString());

        result.AssertNoContent();

        var updatedCourse = await _context.Courses.FindAsync(course.Id);
        Assert.NotNull(updatedCourse);
        Assert.Null(updatedCourse.ProfessorId);
    }
}
