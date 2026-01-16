using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Professors.Common.Responses;
using StudentEnrollment.Features.Professors.GetDetails;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using tests.Common;

namespace tests.Professors;

public class GetProfessorDetailsTest : BaseHandlerTest
{
    private readonly GetProfessorDetailsHandler _sut;

    public GetProfessorDetailsTest()
    {
        _sut = new GetProfessorDetailsHandler(_context);
    }

    [Fact]
    public async Task GetProfessorDetails_Succeeds_WhenProfessorExistsByProfessorId()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id, professorCode: "PROF-001");
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(professor.Id.ToString());

        var okResult = result.AssertOk<ProfessorResponse>();

        Assert.NotNull(okResult.Value);
        Assert.Equal(professor.Id, okResult.Value.Id);
        Assert.Equal(professor.ProfessorCode, okResult.Value.ProfessorCode);
        Assert.Equal(user.Id, okResult.Value.UserId);
    }

    [Fact]
    public async Task GetProfessorDetails_Succeeds_WhenProfessorExistsByProfessorCode()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id, professorCode: "PROF-12345");
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync("PROF-12345");

        var okResult = result.AssertOk<ProfessorResponse>();

        Assert.NotNull(okResult.Value);
        Assert.Equal(professor.Id, okResult.Value.Id);
        Assert.Equal(professor.ProfessorCode, okResult.Value.ProfessorCode);
        Assert.Equal(user.Id, okResult.Value.UserId);
    }

    [Fact]
    public async Task GetProfessorDetails_ReturnsNotFound_WhenProfessorDoesNotExistById()
    {
        var result = await _sut.HandleAsync("999");

        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task GetProfessorDetails_ReturnsNotFound_WhenProfessorDoesNotExistByCode()
    {
        var result = await _sut.HandleAsync("PROF-NOTFOUND");

        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task GetProfessorDetails_ReturnsNotFound_WhenProfessorIsSoftDeleted()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id, isDeleted: true);
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        var result = await _sut.HandleAsync(professor.Id.ToString());

        result.AssertNotFound<ProblemDetails>();
    }
}
