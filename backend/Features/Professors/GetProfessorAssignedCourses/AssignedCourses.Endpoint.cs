using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Professors.GetProfessorAssignedCourses;

public class GetProfessorAssignedCoursesEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                "/{professorIdentifier}/courses",
                async (
                    [FromRoute] string professorIdentifier,
                    [FromServices] AssignedCoursesHandler handler
                ) => await handler.HandleAsync(professorIdentifier)
            )
            .WithName("GetProfessorAssignedCourses")
            .RequireAuthorization("SameProfessor")
            .Produces<ProfessorAssignmentResponse>(StatusCodes.Status200OK)
            .Produces(StatusCodes.Status404NotFound);
    }
}
