using Microsoft.AspNetCore.Identity;
using StudentEnrollment.Shared.Domain.Entities.Common.Abstractions;
using StudentEnrollment.Shared.Domain.Entities.Common.Interfaces;
using StudentEnrollment.Shared.Domain.ValueObjects;

namespace StudentEnrollment.Shared.Domain.Entities;

public class Student : BaseEntity, IAuditableEntity, ISoftDeletableEntity
{
    public string StudentCode { get; set; }
    
    [PersonalData]
    public string FirstName { get; set; }
    [PersonalData]
    public string LastName { get; set; }

    [PersonalData]
    public string Email { get; set; }
    
    [PersonalData]
    public string PhoneNumber { get; set; }
    [PersonalData]
    public Address Address { get; set; }
    
    [PersonalData]
    public DateTime DateOfBirth { get; set; }
    
    [PersonalData]
    [ProtectedPersonalData]
    public string CNP { get; set; }
    
    public int? UserId { get; set; }

    public ICollection<Enrollment> Enrollments { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
    
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public int? DeletedBy { get; set; }
}