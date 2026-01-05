using Microsoft.EntityFrameworkCore;

namespace StudentEnrollment.Features.Common.Pagination;

public static class PaginationExtensions
{
    public static async Task<PaginatedList<T>> ToPaginatedListAsync<T>(
        this IQueryable<T> query,
        PaginationRequest paginationOptions
    )
    {
        var items = await query
            .Skip((paginationOptions.PageIndex - 1) * paginationOptions.PageSize)
            .Take(paginationOptions.PageSize)
            .ToListAsync();

        return new PaginatedList<T>(items, paginationOptions.PageSize, paginationOptions.PageIndex);
    }
}