namespace StudentEnrollment.Features.Common.Pagination;

public class PaginatedList<T>
{
    public IReadOnlyCollection<T> Items { get; init; }
    public int PageCount { get; init; }
    public int ItemsCount { get; init; }
    public int PageIndex { get; init; }
    public int PageSize { get; init; }

    public bool HasPreviousPage => PageIndex > 1;
    public bool HasNextPage => PageIndex < PageCount;

    public PaginatedList(IReadOnlyCollection<T> items, int pageSize, int pageIndex)
    {
        Items = items;
        ItemsCount = items.Count();
        PageSize = pageSize;
        PageCount = (int)Math.Ceiling((double)ItemsCount / pageSize);

        if (pageIndex < 1)
        {
            pageIndex = 1;
        }

        if (PageCount == 0)
        {
            pageIndex = 1;
        }
        else if (pageIndex > PageCount)
        {
            pageIndex = PageCount;
        }

        PageIndex = pageIndex;
    }

    public PaginatedList<TMapped> Map<TMapped>(Func<T, TMapped> converter)
    {
        var mapped = Items.Select(converter).ToList();
        return new PaginatedList<TMapped>(mapped, PageSize, PageIndex);
    }
}
