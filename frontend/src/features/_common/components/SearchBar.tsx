import { TextInput } from '@mantine/core';
import { Search } from 'lucide-react';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';

interface SearchBarProps {
    /** Callback triggered with the debounced search value */
    onSearch: (searchTerm: string) => void;
    /** Placeholder text for the input */
    placeholder?: string;
    /** Optional max width for the input */
    maxWidth?: number;
    /** Optional debounce delay in ms (default 500) */
    debounce?: number;
}

export function SearchBar({
    onSearch,
    placeholder = 'Caută...',
    maxWidth = 400,
    debounce = 500,
}: SearchBarProps) {
    const [searchValue, setSearchValue] = useState('');
    const [debouncedSearch] = useDebouncedValue(searchValue, debounce);

    useEffect(() => {
        onSearch(debouncedSearch);
    }, [debouncedSearch, onSearch]);

    return (
        <TextInput
            placeholder={placeholder}
            leftSection={<Search size={16} />}
            value={searchValue}
            onChange={(event) => setSearchValue(event.currentTarget.value)}
            style={{ maxWidth }}
        />
    );
}
