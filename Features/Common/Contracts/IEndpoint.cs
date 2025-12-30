namespace StudentEnrollment.Features.Common.Contracts;

/// <summary>
/// Defines a contract for configuring and mapping HTTP endpoints in the application.
/// </summary>
public interface IEndpoint
{
    void MapEndpoint(IEndpointRouteBuilder app);
}
