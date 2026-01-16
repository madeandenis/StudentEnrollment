using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentEnrollment.Shared.Domain.Entities;

namespace StudentEnrollment.Shared.Persistence.Configurations;

public class ProfessorConfiguration : IEntityTypeConfiguration<Professor>
{
    public void Configure(EntityTypeBuilder<Professor> builder)
    {
        builder.HasKey(p => p.Id);

        builder.HasQueryFilter("StudentSoftDeletion", p => !p.IsDeleted);

        builder.HasIndex(p => p.ProfessorCode).IsUnique().HasFilter("[IsDeleted] = 0");

        builder.HasIndex(p => p.Email).IsUnique().HasFilter("[IsDeleted] = 0");

        builder
            .HasIndex(p => p.UserId)
            .IsUnique()
            .HasFilter("[IsDeleted] = 0");

        builder
            .Property(p => p.ProfessorCode)
            .HasDefaultValueSql(
                "'PROF-' + RIGHT('0000' + CAST(NEXT VALUE FOR ProfessorCodeSequence AS VARCHAR), 6)"
            );

        builder.Property(p => p.FirstName).HasMaxLength(35);
        builder.Property(p => p.LastName).HasMaxLength(35);
        builder.Property(p => p.Email).HasMaxLength(256);
        builder.Property(p => p.PhoneNumber).HasMaxLength(20);

        builder.OwnsOne(
            ci => ci.Address,
            address =>
            {
                address.Property(a => a.Address1).HasMaxLength(255).IsRequired();
                address.Property(a => a.Address2).HasMaxLength(255).IsRequired(false);
                address.Property(a => a.City).HasMaxLength(100).IsRequired();
                address.Property(a => a.County).HasMaxLength(100).IsRequired(false);
                address.Property(a => a.Country).HasMaxLength(100).IsRequired();
                address.Property(a => a.PostalCode).HasMaxLength(20).IsRequired(false);
            }
        );

        builder.Property(p => p.IsDeleted).HasDefaultValue(false);
    }
}