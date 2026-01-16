using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Professors.Update;
using StudentEnrollment.Shared.Domain.Entities;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using tests.Common;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace tests.Professors;

public class UpdateProfessorTest : BaseHandlerTest
{
    private readonly UpdateProfessorHandler _sut;

    public UpdateProfessorTest()
    {
        var validator = new UpdateProfessorValidator();
        _sut = new UpdateProfessorHandler(validator, _context);
    }

    private static UpdateProfessorRequest ToUpdateProfessorRequest(Professor professor)
    {
        return new UpdateProfessorRequest(
            professor.UserId,
            professor.FirstName,
            professor.LastName,
            professor.Email,
            professor.PhoneNumber,
            professor.Address
        );
    }

    [Theory]
    [MemberData(
        nameof(ProfessorInvalidTestData.InvalidUserIds),
        MemberType = typeof(ProfessorInvalidTestData)
    )]
    public async Task UpdateProfessor_ThrowsValidationError_WhenUserIdIsInvalid(int userId)
    {
        var professor = ProfessorBuilder.Default();
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        professor.UserId = userId;
        var request = ToUpdateProfessorRequest(professor);

        var result = await _sut.HandleAsync(professor.Id, request);

        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(
        nameof(ProfessorInvalidTestData.InvalidFirstNames),
        MemberType = typeof(ProfessorInvalidTestData)
    )]
    public async Task UpdateProfessor_ThrowsValidationError_WhenFirstNameIsInvalid(string firstName)
    {
        var professor = ProfessorBuilder.Default();
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        professor.FirstName = firstName;
        var request = ToUpdateProfessorRequest(professor);

        var result = await _sut.HandleAsync(professor.Id, request);

        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(
        nameof(ProfessorInvalidTestData.InvalidLastNames),
        MemberType = typeof(ProfessorInvalidTestData)
    )]
    public async Task UpdateProfessor_ThrowsValidationError_WhenLastNameIsInvalid(string lastName)
    {
        var professor = ProfessorBuilder.Default();
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        professor.LastName = lastName;
        var request = ToUpdateProfessorRequest(professor);

        var result = await _sut.HandleAsync(professor.Id, request);

        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(
        nameof(ProfessorInvalidTestData.InvalidPhoneNumbers),
        MemberType = typeof(ProfessorInvalidTestData)
    )]
    public async Task UpdateProfessor_ThrowsValidationError_WhenPhoneNumberIsInvalid(
        string phoneNumber
    )
    {
        var professor = ProfessorBuilder.Default();
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        professor.PhoneNumber = phoneNumber;
        var request = ToUpdateProfessorRequest(professor);

        var result = await _sut.HandleAsync(professor.Id, request);

        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(
        nameof(ProfessorInvalidTestData.InvalidAddresses),
        MemberType = typeof(ProfessorInvalidTestData)
    )]
    public async Task UpdateProfessor_ThrowsValidationError_WhenAddressIsInvalid(
        StudentEnrollment.Shared.Domain.ValueObjects.Address address
    )
    {
        var professor = ProfessorBuilder.Default();
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        professor.Address = address;
        var request = ToUpdateProfessorRequest(professor);

        var result = await _sut.HandleAsync(professor.Id, request);

        result.AssertValidationFailed();
    }

    [Fact]
    public async Task UpdateProfessor_ReturnsNotFound_WhenProfessorDoesNotExist()
    {
        var request = ToUpdateProfessorRequest(ProfessorBuilder.Default());

        var result = await _sut.HandleAsync(999, request);

        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task UpdateProfessor_Succeeds_WhenRequestIsValid()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        professor.FirstName = "    Updated";
        professor.LastName = "Professor    ";
        professor.Email = "updated@test.local";
        professor.PhoneNumber = "0711222333";

        var request = ToUpdateProfessorRequest(professor);

        var result = await _sut.HandleAsync(professor.Id, request);

        result.AssertOk();

        var updatedProfessor = await _context.Professors.FindAsync(professor.Id);

        // Data normalization is done in the handler
        Assert.NotNull(updatedProfessor);
        Assert.Equal(Normalize(request.FirstName), updatedProfessor.FirstName);
        Assert.Equal(NormalizeEmail(request.LastName), updatedProfessor.LastName);
        Assert.Equal(Normalize(request.Email), updatedProfessor.Email);
        Assert.Equal(request.PhoneNumber, updatedProfessor.PhoneNumber);
    }

    [Fact]
    public async Task UpdateProfessor_ThrowsConflict_WhenEmailAlreadyExists()
    {
        var user1 = new ApplicationUser();
        var user2 = new ApplicationUser();
        _context.Users.Add(user1);
        _context.Users.Add(user2);
        await _context.SaveChangesAsync();

        var professor1 = ProfessorBuilder.Default(email: "professor1@test.local", userId: user1.Id);
        var professor2 = ProfessorBuilder.Default(email: "professor1@test.local", userId: user2.Id);

        _context.Professors.Add(professor1);
        _context.Professors.Add(professor2);

        await _context.SaveChangesAsync();

        // Try to update professor2's email to match professor1's email
        professor2.Email = professor1.Email;

        var updateRequest = ToUpdateProfessorRequest(professor2);

        var result = await _sut.HandleAsync(professor2.Id, updateRequest);

        result.AssertConflict<ProblemDetails>();
    }

    [Fact]
    public async Task UpdateProfessor_ThrowsConflict_WhenUserIdAlreadyAssigned()
    {
        var user1 = new ApplicationUser();
        var user2 = new ApplicationUser();
        _context.Users.Add(user1);
        _context.Users.Add(user2);
        await _context.SaveChangesAsync();

        var professor1 = ProfessorBuilder.Default(email: "professor1@test.local", userId: user1.Id);
        var professor2 = ProfessorBuilder.Default(email: "professor2@test.local", userId: user2.Id);

        _context.Professors.Add(professor1);
        _context.Professors.Add(professor2);
        await _context.SaveChangesAsync();

        professor2.UserId = professor1.UserId;
        var request = ToUpdateProfessorRequest(professor2);

        var result = await _sut.HandleAsync(professor2.Id, request);

        result.AssertConflict<ProblemDetails>();
    }

    [Fact]
    public async Task UpdateProfessor_ThrowsNotFound_WhenUserDoesNotExist()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        professor.UserId = 999;
        var request = ToUpdateProfessorRequest(professor);

        var result = await _sut.HandleAsync(professor.Id, request);

        result.AssertNotFound<ProblemDetails>();
    }

    [Fact]
    public async Task UpdateProfessor_Succeeds_WhenUpdatingToSameEmail()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        professor.FirstName = "Updated";
        var request = ToUpdateProfessorRequest(professor);

        var result = await _sut.HandleAsync(professor.Id, request);

        result.AssertOk();

        var updatedProfessor = await _context.Professors.FindAsync(professor.Id);
        Assert.NotNull(updatedProfessor);
        Assert.Equal(NormalizeEmail(request.Email), updatedProfessor.Email);
    }

    [Fact]
    public async Task UpdateProfessor_Succeeds_WhenUpdatingToSameUserId()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        professor.FirstName = "Updated";
        var request = ToUpdateProfessorRequest(professor);

        var result = await _sut.HandleAsync(professor.Id, request);

        result.AssertOk();

        var updatedProfessor = await _context.Professors.FindAsync(professor.Id);
        Assert.NotNull(updatedProfessor);
        Assert.Equal(user.Id, updatedProfessor.UserId);
    }

    [Fact]
    public async Task UpdateProfessor_Succeeds_WhenChangingUserIdToExistingUser()
    {
        var user1 = new ApplicationUser();
        var user2 = new ApplicationUser();
        _context.Users.Add(user1);
        _context.Users.Add(user2);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user1.Id);
        _context.Professors.Add(professor);
        await _context.SaveChangesAsync();

        professor.UserId = user2.Id;
        var request = ToUpdateProfessorRequest(professor);

        var result = await _sut.HandleAsync(professor.Id, request);

        result.AssertOk();

        var updatedProfessor = await _context.Professors.FindAsync(professor.Id);
        Assert.NotNull(updatedProfessor);
        Assert.Equal(user2.Id, updatedProfessor.UserId);
    }
}
