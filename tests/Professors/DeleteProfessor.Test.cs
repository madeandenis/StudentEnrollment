using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Professors.Delete;
using StudentEnrollment.Shared.Domain.Entities;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using tests.Common;
using tests.Courses;

namespace tests.Professors;

public class DeleteProfessorTest : BaseHandlerTest
{
    private readonly DeleteProfessorHandler _sut;

    public DeleteProfessorTest()
    {
        _sut = new DeleteProfessorHandler(_context);
    }

    [Fact]
    public async Task DeleteProfessor_Succeeds_WhenProfessorExistsAndHasNoCourses()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(professor.Id);

        result.AssertNoContent();
    }

    [Fact]
    public async Task DeleteProfessor_ReturnsNotFound_WhenProfessorDoesNotExist()
    {
        var result = await _sut.HandleAsync(999);

        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task DeleteProfessor_Succeeds_WhenProfessorHasAssignedCourses()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        var courses = new[]
        {
            CourseBuilder.Default(id: 1, courseCode: "CS-101", professorId: professor.Id),
            CourseBuilder.Default(id: 2, courseCode: "CS-102", professorId: professor.Id),
            CourseBuilder.Default(id: 3, courseCode: "CS-103", professorId: professor.Id),
        };

        _context.Courses.AddRange(courses);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(professor.Id);

        result.AssertNoContent();
    }

    [Fact]
    public async Task DeleteProfessor_UnassignsCourses_WhenProfessorIsDeleted()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        var courses = new[]
        {
            CourseBuilder.Default(id: 1, courseCode: "CS-101", professorId: professor.Id),
            CourseBuilder.Default(id: 2, courseCode: "CS-102", professorId: professor.Id),
        };

        _context.Courses.AddRange(courses);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(professor.Id);

        result.AssertNoContent();

        // Verify courses still exist but have null ProfessorId
        var updatedCourses = await _context
            .Courses.Where(c => c.Id == 1 || c.Id == 2)
            .ToListAsync();

        Assert.Equal(2, updatedCourses.Count);
        Assert.All(updatedCourses, course => Assert.Null(course.ProfessorId));
    }

    [Fact]
    public async Task DeleteProfessor_OnlyUnassignsRelatedCourses_NotOtherProfessorsCourses()
    {
        var user1 = new ApplicationUser();
        var user2 = new ApplicationUser();
        _context.Users.AddRange(user1, user2);
        await _context.SaveChangesAsync();

        var professor1 = ProfessorBuilder.Default(userId: user1.Id, email: "prof1@test.local");
        var professor2 = ProfessorBuilder.Default(userId: user2.Id, email: "prof2@test.local");
        _context.Professors.AddRange(professor1, professor2);
        await _context.SaveChangesAsync();

        var coursesProf1 = new[]
        {
            CourseBuilder.Default(id: 1, courseCode: "CS-101", professorId: professor1.Id),
            CourseBuilder.Default(id: 2, courseCode: "CS-102", professorId: professor1.Id),
        };

        var coursesProf2 = new[]
        {
            CourseBuilder.Default(id: 3, courseCode: "CS-201", professorId: professor2.Id),
            CourseBuilder.Default(id: 4, courseCode: "CS-202", professorId: professor2.Id),
        };

        _context.Courses.AddRange(coursesProf1);
        _context.Courses.AddRange(coursesProf2);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(professor1.Id);

        result.AssertNoContent();

        // Verify professor1's courses are unassigned
        var prof1Courses = await _context.Courses.Where(c => c.Id == 1 || c.Id == 2).ToListAsync();

        Assert.All(prof1Courses, course => Assert.Null(course.ProfessorId));

        // Verify professor2's courses are still assigned
        var prof2Courses = await _context.Courses.Where(c => c.Id == 3 || c.Id == 4).ToListAsync();

        Assert.All(prof2Courses, course => Assert.Equal(professor2.Id, course.ProfessorId));
    }
}
