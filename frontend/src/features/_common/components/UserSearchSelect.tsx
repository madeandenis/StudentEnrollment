import {
  Select,
  Loader,
  Text,
  Group,
  Avatar,
  type SelectProps,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useState } from "react";
import { Search } from "lucide-react";
import { useUserList } from "@/features/users/get-list/useUserList";
import type { UserResponse } from "@/features/users/_common/types";

interface UserSearchSelectProps {
  value: number | null;
  onChange: (userId: number | null, user: UserResponse | null) => void;
  error?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  excludeWithProfessor?: boolean;
}

export function UserSearchSelect({
  value,
  onChange,
  error,
  label = "Utilizator",
  placeholder = "Caută utilizator după email...",
  required = false,
  disabled = false,
  excludeWithProfessor = false,
}: UserSearchSelectProps) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  const { data: usersData, isLoading } = useUserList({
    PageIndex: 1,
    PageSize: 10,
    IsAdmin: false,
    Search: debouncedSearch || undefined,
    ExcludeWithProfessor: excludeWithProfessor,
  });

  const users = usersData?.items || [];

  const selectData = users.map((user) => ({
    value: user.id.toString(),
    label: user.email || user.userName || "N/A",
  }));

  const renderSelectOption: SelectProps["renderOption"] = ({ option }) => (
    <Group gap="sm" wrap="nowrap">
      <Avatar size="sm" radius="xl" color="blue" variant="light">
        {option.label?.charAt(0).toUpperCase()}
      </Avatar>
      <Text size="sm">{option.label}</Text>
    </Group>
  );

  const handleChange = (selectedValue: string | null) => {
    if (!selectedValue) {
      onChange(null, null);
      return;
    }
    const userId = parseInt(selectedValue);
    const user = users.find((u) => u.id === userId);
    onChange(userId, user || null);
  };

  return (
    <Select
      label={label}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      error={error}
      value={value?.toString() || null}
      onChange={handleChange}
      data={selectData}
      searchable
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      leftSection={<Search size={16} />}
      rightSection={isLoading ? <Loader size="xs" /> : null}
      renderOption={renderSelectOption}
      nothingFoundMessage={
        debouncedSearch
          ? "Nu s-au găsit utilizatori"
          : "Începe să scrii pentru a căuta"
      }
      comboboxProps={{
        shadow: "md",
        transitionProps: {
          transition: "slide-down",
          duration: 200,
        },
        dropdownPadding: 5,
      }}
    />
  );
}
