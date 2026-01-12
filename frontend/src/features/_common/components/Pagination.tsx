import { Group, Pagination as MantinePagination, Select, Text } from '@mantine/core';

interface GenericPaginationProps {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    itemLabel?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
    itemLabel = 'element',
}: GenericPaginationProps) {
    const pageSizeOptions = [
        { value: '10', label: '10 pe pagină' },
        { value: '25', label: '25 pe pagină' },
        { value: '50', label: '50 pe pagină' },
        { value: '100', label: '100 pe pagină' },
    ];

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

    return (
        <Group justify="space-between" mt="md">
            <Text size="sm" c="dimmed">
                Afișare {startItem}-{endItem} din {totalItems} {itemLabel}
            </Text>

            <Group gap="md">
                <Select
                    value={pageSize.toString()}
                    onChange={(value) => onPageSizeChange(Number(value))}
                    data={pageSizeOptions}
                    style={{ width: 150 }}
                    size="sm"
                />
                <MantinePagination
                    total={totalPages}
                    value={currentPage}
                    onChange={onPageChange}
                    size="sm"
                />
            </Group>
        </Group>
    );
}
