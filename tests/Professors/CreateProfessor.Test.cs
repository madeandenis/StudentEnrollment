using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Professors.Create;
using StudentEnrollment.Shared.Domain.Entities;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using tests.Common;
using tests.Students;

namespace tests.Professors;

public class CreateProfessorTest : BaseHandlerTest
{
    private readonly CreateProfessorHandler _sut;

    public CreateProfessorTest()
    {
        var validator = new CreateProfessorValidator();
        _sut = new CreateProfessorHandler(validator, _context);
    }

    private static CreateProfessorRequest ToCreateProfessorRequest(Professor professor)
    {
        return new CreateProfessorRequest(
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
    public async Task CreateProfessor_ThrowsValidationError_WhenUserIdIsInvalid(int userId)
    {
        var professor = ProfessorBuilder.Default(userId: userId);
        var request = ToCreateProfessorRequest(professor);

        var result = await _sut.HandleAsync(request);

        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(
        nameof(ProfessorInvalidTestData.InvalidFirstNames),
        MemberType = typeof(ProfessorInvalidTestData)
    )]
    public async Task CreateProfessor_ThrowsValidationError_WhenFirstNameIsInvalid(string firstName)
    {
        var professor = ProfessorBuilder.Default(firstName: firstName);
        var request = ToCreateProfessorRequest(professor);

        var result = await _sut.HandleAsync(request);

        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(
        nameof(ProfessorInvalidTestData.InvalidLastNames),
        MemberType = typeof(ProfessorInvalidTestData)
    )]
    public async Task CreateProfessor_ThrowsValidationError_WhenLastNameIsInvalid(string lastName)
    {
        var professor = ProfessorBuilder.Default(lastName: lastName);
        var request = ToCreateProfessorRequest(professor);

        var result = await _sut.HandleAsync(request);

        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(
        nameof(ProfessorInvalidTestData.InvalidPhoneNumbers),
        MemberType = typeof(ProfessorInvalidTestData)
    )]
    public async Task CreateProfessor_ThrowsValidationError_WhenPhoneNumberIsInvalid(
        string phoneNumber
    )
    {
        var professor = ProfessorBuilder.Default(phoneNumber: phoneNumber);
        var request = ToCreateProfessorRequest(professor);

        var result = await _sut.HandleAsync(request);

        result.AssertValidationFailed();
    }

    [Theory]
    [MemberData(
        nameof(ProfessorInvalidTestData.InvalidAddresses),
        MemberType = typeof(ProfessorInvalidTestData)
    )]
    public async Task CreateProfessor_ThrowsValidationError_WhenAddressIsInvalid(
        StudentEnrollment.Shared.Domain.ValueObjects.Address address
    )
    {
        var professor = ProfessorBuilder.Default(address: address);
        var request = ToCreateProfessorRequest(professor);

        var result = await _sut.HandleAsync(request);

        result.AssertValidationFailed();
    }

    [Fact]
    public async Task CreateProfessor_Succeeds_WhenValid()
    {
        var user = new ApplicationUser();
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var professor = ProfessorBuilder.Default(userId: user.Id);
        var request = ToCreateProfessorRequest(professor);

        var result = await _sut.HandleAsync(request);

        result.AssertCreatedAtRoute<CreateProfessorResponse>();
    }
    
    [Fact]
    public async Task CreateProfessor_ThrowsConflict_WhenEmailAlreadyExists()
    {
        var existingProfessor = ProfessorBuilder.Default();
        _context.Professors.Add(existingProfessor);
        await _context.SaveChangesAsync();

        var newProfessor = ProfessorBuilder.Default(email: existingProfessor.Email);
        var request = ToCreateProfessorRequest(newProfessor);

        var result = await _sut.HandleAsync(request);

        result.AssertConflict<ProblemDetails>();
    }

    [Fact]
    public async Task CreateProfessor_ThrowsConflict_WhenUserIdAlreadyAssigned()
    {
        var existingProfessor = ProfessorBuilder.Default();
        _context.Professors.Add(existingProfessor);
        await _context.SaveChangesAsync();

        var newProfessor = ProfessorBuilder.Default(email: "unique@example.com", userId: existingProfessor.UserId);
        var request = ToCreateProfessorRequest(newProfessor);

        var result = await _sut.HandleAsync(request);

        result.AssertConflict<ProblemDetails>();
    }

    [Fact]
    public async Task CreateProfessor_ThrowsNotFound_WhenUserDoesNotExist()
    {
        var professor = ProfessorBuilder.Default(userId: 999); 
        var request = ToCreateProfessorRequest(professor);

        var result = await _sut.HandleAsync(request);

        result.AssertNotFound<ProblemDetails>();
    }
}
