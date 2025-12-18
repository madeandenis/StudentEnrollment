using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using StudentEnrollment.Shared.Domain.Entities;

namespace StudentEnrollment.Shared.Persistence.Configurations;

public class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.HasKey(c => c.Id);
        builder.HasAlternateKey(c => c.CourseCode);

        builder.HasIndex(c => c.CourseCode).IsUnique();
        
        builder.Property(c => c.CourseCode).HasMaxLength(20);
        builder.Property(c => c.Name).HasMaxLength(150);
        builder.Property(c => c.Description).HasMaxLength(500);
    }
}