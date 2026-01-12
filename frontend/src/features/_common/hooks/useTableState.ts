import { useState, useCallback } from 'react';

export interface TableFilters {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    [key: string]: any;
}

export interface TableStateConfig {
    initialPageSize?: number;
    initialFilters?: TableFilters;
}

export interface UseTableStateReturn {
    pageIndex: number;
    pageSize: number;
    filters: TableFilters;
    setPageIndex: (page: number) => void;
    setPageSize: (size: number) => void;
    setSearch: (search: string) => void;
    setSort: (column: string) => void;
    setFilter: (key: string, value: any) => void;
    resetFilters: () => void;
    resetPagination: () => void;
    reset: () => void;
}

export function useTableState(config: TableStateConfig = {}): UseTableStateReturn {
    const {
        initialPageSize = 10,
        initialFilters = {}
    } = config;

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSizeState] = useState(initialPageSize);
    const [filters, setFilters] = useState<TableFilters>(initialFilters);

    const setPageSize = useCallback((size: number) => {
        setPageSizeState(size);
        setPageIndex(1);
    }, []);

    const setSearch = useCallback((search: string) => {
        setFilters(prev => ({ ...prev, search }));
        setPageIndex(1);
    }, []);

    const setSort = useCallback((column: string) => {
        setFilters(prev => {
            const isSameColumn = prev.sortBy === column;
            return {
                ...prev,
                sortBy: column,
                sortOrder: isSameColumn && prev.sortOrder === 'asc' ? 'desc' : 'asc',
            };
        });
    }, []);

    const setFilter = useCallback((key: string, value: any) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPageIndex(1); // Reset to first page
    }, []);

    const resetFilters = useCallback(() => {
        setFilters(initialFilters);
        setPageIndex(1);
    }, [initialFilters]);

    const resetPagination = useCallback(() => {
        setPageIndex(1);
        setPageSizeState(initialPageSize);
    }, [initialPageSize]);

    const reset = useCallback(() => {
        setPageIndex(1);
        setPageSizeState(initialPageSize);
        setFilters(initialFilters);
    }, [initialPageSize, initialFilters]);

    return {
        pageIndex,
        pageSize,
        filters,
        setPageIndex,
        setPageSize,
        setSearch,
        setSort,
        setFilter,
        resetFilters,
        resetPagination,
        reset,
    };
}