using Microsoft.AspNetCore.Mvc;
using StudentEnrollment.Features.Common.Contracts;
using StudentEnrollment.Features.Professors.Common.Responses;

namespace StudentEnrollment.Features.Professors.GetDetails;

public class GetProfessorDetailsEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet(
                "/{professorIdentifier}",
                async (
                    [FromRoute] string professorIdentifier,
                    [FromServices] GetProfessorDetailsHandler handler
                ) => await handler.HandleAsync(professorIdentifier)
            )
            .WithName("GetProfessorById")
            .RequireAuthorization("SameProfessor")
            .Produces<ProfessorResponse>()
            .Produces(StatusCodes.Status404NotFound);
    }
}
