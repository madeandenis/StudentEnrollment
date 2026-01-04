using FluentValidation;
using StudentEnrollment.Features.Courses.Common.Validators;

namespace StudentEnrollment.Features.Courses.Update;

public class UpdateCourseValidator : AbstractValidator<UpdateCourseRequest>
{
    public UpdateCourseValidator()
    {
        Include(new CourseBaseValidator());
    }
}