export interface PaginatedList<T> {
    items: T[];
    pageCount: number;
    itemsCount: number;
    pageIndex: number;
    pageSize: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface Address {
    address1: string;
    address2: string | null;
    city: string;
    county: string | null;
    country: string;
    postalCode: string | null;
}
