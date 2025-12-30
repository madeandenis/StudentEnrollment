using System.Reflection;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Common.Configuration;

public static class EndpointsExtension
{
    extension(WebApplication app)
    {
        /// <summary>
        /// Maps all endpoints in the current assembly to the <paramref name="app"/>, optionally under a common prefix.
        /// </summary>
        public void MapAllEndpoints(string prefix = "")
        {
            var assembly = Assembly.GetExecutingAssembly();

            // Discover all non-abstract, non-interface types implementing IEndpoint
            var endpoints = assembly
                .GetTypes()
                .Where(t => t is { IsInterface: false, IsAbstract: false } &&
                            typeof(IEndpoint).IsAssignableFrom(t)
                );

            // Group endpoints by their second-to-last namespace segment (e.g., Features.Auth -> "Auth")
            var groups = endpoints.GroupBy(t => t.Namespace!.Split('.')[^2]);

            foreach (var group in groups)
            {
                var groupName = group.Key.ToLower();
                    
                var groupPath = string.IsNullOrEmpty(prefix) 
                    ? $"/{groupName}" 
                    : $"/{prefix}/{groupName}";
                var routeGroup = app.MapGroup(groupPath);

                // Instantiate and map all the endpoints
                foreach (var type in group)
                {
                    var endpoint = (IEndpoint)Activator.CreateInstance(type)!;
                    endpoint.MapEndpoint(routeGroup);
                }
            }
        }
    }
}