using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using StudentEnrollment.Shared.Domain.Entities.Common.Interfaces;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Shared.Persistence.Interceptors;

/// <summary>
/// EF Core interceptor that automatically applies soft delete behavior on entities implementing <see cref="ISoftDeletableEntity"/>.
/// When an entity is marked as Deleted, this interceptor sets IsDeleted, DeletedAt, and DeletedBy properties instead of physically removing it.
/// </summary>
public class SoftDeletableEntityInterceptor(ICurrentUserService currentUserService)
    : SaveChangesInterceptor
{
    /// <summary>
    /// Intercepts synchronous SaveChanges calls to apply soft delete properties before changes are persisted.
    /// </summary>
    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result
    )
    {
        if (eventData.Context is not null)
        {
            ApplySoftDelete(eventData.Context);
        }

        return base.SavingChanges(eventData, result);
    }

    /// <summary>
    /// Intercepts asynchronous SaveChanges calls to apply soft delete properties before changes are persisted.
    /// </summary>
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default
    )
    {
        if (eventData.Context is not null)
        {
            ApplySoftDelete(eventData.Context);
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    // Scans the DbContext's ChangeTracker for entities implementing ISoftDeletableEntity
    // that are in the Deleted state and applies soft delete metadata.
    private void ApplySoftDelete(DbContext dbContext)
    {
        var entries = dbContext
            .ChangeTracker.Entries<ISoftDeletableEntity>()
            .Where(e => e.State is EntityState.Deleted);

        var now = DateTime.UtcNow;
        foreach (var entry in entries)
        {
            UpdateSoftDeleteProperties(entry, now);
        }
    }

    // Updates the soft delete properties of a single entity entry:
    private void UpdateSoftDeleteProperties(EntityEntry<ISoftDeletableEntity> entry, DateTime now)
    {
        var entity = entry.Entity;
        entity.IsDeleted = true;
        entity.DeletedAt = now;
        entity.DeletedBy = currentUserService.RequiredUserId();
    }
}
