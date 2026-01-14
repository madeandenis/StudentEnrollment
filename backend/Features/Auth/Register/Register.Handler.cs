using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StudentEnrollment.Features.Common;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Shared.Domain.Entities.Identity;
using StudentEnrollment.Shared.Persistence;
using StudentEnrollment.Shared.Security.Services;

namespace StudentEnrollment.Features.Auth.Register;

/// <summary>
/// Handles user registration requests by creating new user accounts.
/// Automatically links the user account to an existing student record if the email matches.
/// </summary>
public class RegisterHandler(
    RegisterValidator validator,
    UserManager<ApplicationUser> userManager,
    ClaimsIdentityFactory identityFactory,
    ApplicationDbContext context
) : IHandler
{
    /// <summary>
    /// Handles the registration request asynchronously.
    /// Creates a new user account and optionally links it to an existing student record.
    /// </summary>
    /// <param name="request">The registration request containing email and password.</param>
    /// <returns>
    /// An <see cref="IResult"/> containing:
    /// - 201 Created with user claims if successful
    /// - 400 Bad Request if validation fails or user creation fails
    /// - 409 Conflict if a user with the same email already exists
    /// </returns>
    public async Task<IResult> HandleAsync(RegisterRequest request)
    {
        var validationResult = await validator.ValidateAsync(request);
        if (!validationResult.IsValid)
            return Results.ValidationProblem(validationResult.ToDictionary());

        var user = new ApplicationUser { Email = request.Email, UserName = request.Email };

        var signupResult = await userManager.CreateAsync(user, request.Password);

        // TODO: If using email confirmation, there is no need to affirm duplicated emails.

        if (!signupResult.Succeeded)
        {
            var errors = signupResult.Errors.Select(e => e.Description).ToArray();
            var errorMessages = string.Join(", ", errors);

            if (
                signupResult.Errors.Any(e =>
                    e.Code == "DuplicateUserName" || e.Code == "DuplicateEmail"
                )
            )
            {
                return Results.Conflict(
                    Problems.Conflict("A user with this email already exists.")
                );
            }

            return Results.BadRequest(Problems.BadRequest(errorMessages));
        }

        var student = await context.Students.FirstOrDefaultAsync(s =>
            s.Email == user.NormalizedEmail
        );
        if (student is not null)
        {
            student.UserId = user.Id;
            student.UpdatedAt = DateTime.UtcNow;
            student.UpdatedBy = user.Id; 
            
            context.Students.Update(student);   
            await context.SaveChangesAsync();
        }

        var identity = await identityFactory.CreateAsync(user, student);

        return Results.Created($"/auth/me", ClaimsUser.FromClaimsIdentity(identity));
    }
}
