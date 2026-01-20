import { Select, Loader, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { useState } from "react";
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
}

export function UserSearchSelect({
  value,
  onChange,
  error,
  label = "Utilizator",
  placeholder = "Caută utilizator după email...",
  required = false,
  disabled = false,
}: UserSearchSelectProps) {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchValue, 300);

  // Fetch users based on search
  const { data: usersData, isLoading } = useUserList({
    PageIndex: 1,
    PageSize: 20,
    // IsAdmin: false,
    Search: debouncedSearch || undefined,
  });

  const users = usersData?.items || [];

  // Convert users to select options
  const selectData = users.map((user) => ({
    value: user.id.toString(),
    label: `${user.email || user.userName || "N/A"} (ID: ${user.id})`,
  }));

  // Find selected user
  const selectedUser = users.find((u) => u.id === value);

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
      nothingFoundMessage={
        isLoading ? (
          <Text size="sm" c="dimmed" ta="center">
            <Loader size="xs" /> Se încarcă...
          </Text>
        ) : (
          <Text size="sm" c="dimmed">
            {debouncedSearch
              ? "Nu s-au găsit utilizatori"
              : "Începe să scrii pentru a căuta"}
          </Text>
        )
      }
      rightSection={isLoading ? <Loader size="xs" /> : undefined}
      description={
        selectedUser
          ? `Selectat: ${selectedUser.email || selectedUser.userName} - Roluri: ${selectedUser.roles.join(", ")}`
          : "Caută și selectează un utilizator din sistem"
      }
    />
  );
}
