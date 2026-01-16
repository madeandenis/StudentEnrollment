using StudentEnrollment.Shared.Domain.Entities;
using StudentEnrollment.Shared.Domain.ValueObjects;
using static StudentEnrollment.Shared.Utilities.StringNormalizationService;

namespace tests.Professors;

public static class ProfessorBuilder
{
    private static readonly Address DefaultAddress = new Address
    {
        Address1 = "123 Main St",
        Address2 = "Apt 1",
        City = "Test City",
        County = "Test County",
        Country = "Test Country",
        PostalCode = "12345"
    };
    
    public static Professor Default(
        int id = 0,
        string professorCode = "PROF-0001",
        int userId = 1,
        string firstName = "Test",
        string lastName = "Professor",
        string email = "professor@test.local",
        string phoneNumber = "0700000000",
        Address? address = null,
        bool isDeleted = false,
        int createdBy = 1
    )
    {
        return new Professor
        {
            Id = id,
            ProfessorCode = NormalizeEmail(professorCode),
            UserId = userId,
            FirstName = Normalize(firstName),
            LastName = Normalize(lastName),
            Email = NormalizeEmail(email),
            PhoneNumber = phoneNumber,
            Address = address ?? DefaultAddress,
            Courses = new List<Course>(),
            IsDeleted = isDeleted,
            CreatedBy = createdBy
        };
    }
}