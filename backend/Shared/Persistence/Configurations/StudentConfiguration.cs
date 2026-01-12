using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentEnrollment.Shared.Domain.Entities;

namespace StudentEnrollment.Shared.Persistence.Configurations;

public class StudentConfiguration : IEntityTypeConfiguration<Student>
{
    public void Configure(EntityTypeBuilder<Student> builder)
    {
        builder.HasKey(s => s.Id);

        builder.HasQueryFilter("StudentSoftDeletion", s => !s.IsDeleted);

        builder.HasIndex(s => s.StudentCode).IsUnique().HasFilter("[IsDeleted] = 0");

        builder.HasIndex(s => s.Email).IsUnique().HasFilter("[IsDeleted] = 0");

        builder.HasIndex(s => s.CNP).IsUnique().HasFilter("[IsDeleted] = 0");

        builder
            .HasIndex(s => s.UserId)
            .IsUnique()
            .HasFilter("[UserId] IS NOT NULL AND [IsDeleted] = 0");

        builder
            .Property(s => s.StudentCode)
            .HasDefaultValueSql(
                "RIGHT('000000' + CAST(NEXT VALUE FOR StudentCodeSequence AS VARCHAR), 6)"
            );

        builder.Property(s => s.FirstName).HasMaxLength(35);
        builder.Property(s => s.LastName).HasMaxLength(35);
        builder.Property(s => s.Email).HasMaxLength(256);
        builder.Property(s => s.PhoneNumber).HasMaxLength(20);

        // TODO: Add encryption for CNP
        builder.Property(s => s.CNP).HasMaxLength(13).IsFixedLength();

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

        builder.Property(s => s.IsDeleted).HasDefaultValue(false);
    }
}
