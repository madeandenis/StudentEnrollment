using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;

namespace StudentEnrollment.Features.Common.Pagination;

/// <summary>
/// Provides extension methods for performing efficient pagination on <see cref="IQueryable{T}"/> streams.
/// </summary>
public static class PaginationExtensions
{
    
    /// <summary>
    /// Converts a queryable source into a paginated list of the source type.
    /// </summary>
    /// <typeparam name="T">The type of the elements in the source query.</typeparam>
    /// <param name="query">The queryable source to paginate.</param>
    /// <param name="paginationOptions">The pagination parameters including page index and page size.</param>
    /// <returns>A <see cref="Task"/> representing the asynchronous operation, containing the <see cref="PaginatedList{T}"/>.</returns>
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