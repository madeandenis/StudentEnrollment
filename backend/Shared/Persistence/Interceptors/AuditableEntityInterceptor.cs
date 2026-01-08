using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Diagnostics;
using StudentEnrollment.Shared.Domain.Entities.Common.Interfaces;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Shared.Persistence.Interceptors;

/// <summary>
/// EF Core interceptor that automatically sets audit properties (CreatedAt, CreatedBy, UpdatedAt, UpdatedBy)
/// on entities implementing <see cref="IAuditableEntity"/> during SaveChanges and SaveChangesAsync.
/// </summary>
public class AuditableEntityInterceptor(CurrentUserService currentUserService) : SaveChangesInterceptor
{
    /// <summary>
    /// Intercepts synchronous SaveChanges calls to apply auditing properties before changes are persisted.
    /// </summary>
    public override InterceptionResult<int> SavingChanges(
        DbContextEventData eventData,
        InterceptionResult<int> result)
    {
        if (eventData.Context is not null)
        {
            ApplyAuditing(eventData.Context);
        }

        return base.SavingChanges(eventData, result);
    }

    /// <summary>
    /// Intercepts asynchronous SaveChanges calls to apply auditing properties before changes are persisted.
    /// </summary>
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData,
        InterceptionResult<int> result,
        CancellationToken cancellationToken = default)
    {
        if (eventData.Context is not null)
        {
            ApplyAuditing(eventData.Context);
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }

    // Scans the DbContext's ChangeTracker for entities implementing IAuditableEntity
    // that are Added or Modified, and sets their audit properties accordingly.
    private void ApplyAuditing(DbContext dbContext)
    {
        var entries = dbContext.ChangeTracker.Entries<IAuditableEntity>()
            .Where(e => e.State is EntityState.Added or EntityState.Modified);

        var now = DateTime.UtcNow;
        foreach (var entry in entries)
        {
            UpdateAuditableProperties(entry, now);
        }
    }

    // Updates the audit properties of a single entity entry.
    // - Sets CreatedAt and CreatedBy only for newly added entities (unless already assigned).
    // - Updates UpdatedAt and UpdatedBy for both added and modified entities.
    private void UpdateAuditableProperties(EntityEntry<IAuditableEntity> entry, DateTime now)
    {
        var entity = entry.Entity;

        if (entry.State is EntityState.Added)
        {
            if (entity.CreatedAt == default) 
            {
                entity.CreatedAt = now;
            }

            if (entity.CreatedBy == 0)
            {
                entity.CreatedBy = currentUserService.RequiredUserId();
            }
        }

        entity.UpdatedAt = now;
        entity.UpdatedBy = currentUserService.RequiredUserId();
    }
}