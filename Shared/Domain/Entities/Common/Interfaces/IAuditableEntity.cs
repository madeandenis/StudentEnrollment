namespace StudentEnrollment.Shared.Domain.Entities.Common.Interfaces;

public interface IAuditableEntity
{
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    public int CreatedBy { get; set; }
    public int? UpdatedBy { get; set; }
}