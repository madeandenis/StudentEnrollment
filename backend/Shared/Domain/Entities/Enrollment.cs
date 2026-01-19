using StudentEnrollment.Shared.Domain.Entities.Common.Interfaces;

namespace StudentEnrollment.Shared.Domain.Entities;

public class Enrollment : IAuditableEntity
{
    public int StudentId { get; set; }
    public int CourseId { get; set; }

    public decimal? Grade { get; set; }
    public int? AssignedByProfessorId { get; set; }

    public Student Student { get; set; }
    public Course Course { get; set; }

    public Professor? AssignedByProfessor { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public int CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
}
