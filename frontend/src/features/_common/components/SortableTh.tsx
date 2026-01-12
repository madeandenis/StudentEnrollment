import React from 'react';
import { Table, UnstyledButton, Center } from '@mantine/core';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

interface SortableThProps {
    children: React.ReactNode;
    sortKey?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onSort?: (column: string) => void;
    width?: number | string;
}

export function SortableTh({ children, sortKey, sortBy, sortOrder, onSort, width }: SortableThProps) {
    const isSorted = sortBy === sortKey;

    if (!sortKey || !onSort) {
        return <Table.Th style={{ width }}>{children}</Table.Th>;
    }

    return (
        <Table.Th style={{ width }}>
            <UnstyledButton
                onClick={() => onSort(sortKey)}
                style={{
                    width: '100%',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontWeight: 600,
                }}
            >
                <span>{children}</span>
                <Center>
                    {!isSorted && <ChevronsUpDown size={14} opacity={0.4} />}
                    {isSorted && sortOrder === 'asc' && <ChevronUp size={14} />}
                    {isSorted && sortOrder === 'desc' && <ChevronDown size={14} />}
                </Center>
            </UnstyledButton>
        </Table.Th>
    );
}
