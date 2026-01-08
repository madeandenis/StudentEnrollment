namespace StudentEnrollment.Shared.Domain.Entities.Common.Interfaces;

public interface ISoftDeletableEntity
{
    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
    public int? DeletedBy { get; set; }
}
