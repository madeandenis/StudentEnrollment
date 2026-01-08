using System.Reflection;
using StudentEnrollment.Features.Common.Contracts;

namespace StudentEnrollment.Features.Common.Configuration;

public static class HandlersExtension
{
    extension(IServiceCollection services)
    {
        /// <summary>
        /// Scans the current assembly for all non-abstract classes implementing <see cref="IHandler"/> 
        /// and registers them with the DI container as scoped services.
        /// </summary>
        public IServiceCollection AddHandlers()
        {
            var assembly = Assembly.GetExecutingAssembly();
            
            var handlers = assembly
                .GetTypes()
                .Where(
                    t => t is { IsClass: true, IsAbstract: false } &&
                    typeof(IHandler).IsAssignableFrom(t)
                );

            foreach (var handler in handlers)
            {
                services.AddScoped(handler);
            }
            
            return services;
        }
    }
}