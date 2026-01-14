using Microsoft.EntityFrameworkCore;
using Moq;
using StudentEnrollment.Shared.Persistence;
using StudentEnrollment.Shared.Persistence.Interceptors;
using StudentEnrollment.Shared.Security.Services;

namespace tests;

public class BaseHandlerTest : IDisposable, IAsyncDisposable
{
    protected readonly ApplicationDbContext _context;
    protected readonly Mock<ICurrentUserService> _currentUserServiceMock;

    protected BaseHandlerTest(string? databaseName = null)
    {
        _currentUserServiceMock = new Mock<ICurrentUserService>();
        
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: databaseName ?? Guid.NewGuid().ToString())
            .AddInterceptors(new AuditableEntityInterceptor(_currentUserServiceMock.Object))
            .Options;

        _context = new ApplicationDbContext(options);
    }

    public void Dispose()
    {
        _context.Database.EnsureDeleted();
        _context.Dispose();
    }

    public async ValueTask DisposeAsync()
    {
        await _context.Database.EnsureDeletedAsync();
        await _context.DisposeAsync();
    }
}
