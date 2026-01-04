using System.ComponentModel.DataAnnotations;
using StudentEnrollment.Shared.Domain.Entities.Common.Abstractions;
using StudentEnrollment.Shared.Domain.Entities.Common.Interfaces;

namespace StudentEnrollment.Shared.Domain.Entities;

public class Course : BaseEntity, IAuditableEntity
{
    public string CourseCode { get; set; }
    
    public string Name { get; set; }
    public string Description { get; set; }

    public int Credits { get; set; }
    public int MaxEnrollment { get; set; }

    public ICollection<Enrollment> Enrollments { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
}
