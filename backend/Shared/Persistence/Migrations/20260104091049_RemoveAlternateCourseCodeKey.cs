using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudentEnrollment.Shared.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveAlternateCourseCodeKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT * FROM sys.objects WHERE name = 'AK_Courses_CourseCode' AND type = 'UQ')
                BEGIN
                    ALTER TABLE [Courses] DROP CONSTRAINT [AK_Courses_CourseCode];
                END"
            );
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddUniqueConstraint(
                name: "AK_Courses_CourseCode",
                table: "Courses",
                column: "CourseCode");
        }
    }
}
