using StudentEnrollment.Shared.Domain.Entities;

namespace tests.Students;

public static class StudentBuilder
{
    public static Student Default(
        int id = 0,
        string studentCode = "STU-0001",
        string firstName = "Test",
        string lastName = "Student",
        string email = "student@test.local",
        string phoneNumber = "0700000000",
        string cnp = "1234567890123",
        bool isDeleted = false,
        int createdBy = 1
    )
    {
        return new Student
        {
            Id = id,
            StudentCode = studentCode,
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            PhoneNumber = phoneNumber,
            CNP = cnp,
            IsDeleted = isDeleted,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = createdBy
        };
    }
}