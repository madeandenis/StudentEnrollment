import { Table, Text, ActionIcon, Group, Tooltip, Center, Badge } from '@mantine/core';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { StudentResponse } from '@/features/students/_common/types';
import { SortableTh } from '@/features/_common/components/SortableTh';

interface StudentsTableProps {
    students: StudentResponse[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: ({ id, fullName }: { id: number; fullName: string }) => void;
    onSort?: (column: string) => void;
}

export function StudentsTable({
    students,
    sortBy,
    sortOrder,
    onView,
    onEdit,
    onDelete,
    onSort
}: StudentsTableProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm" withTableBorder highlightOnHover>
                <Table.Thead bg="gray.0">
                    <Table.Tr>
                        <SortableTh sortKey="StudentCode" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} width={110}>
                            <Text fw={700} size="sm" c="dimmed">Cod</Text>
                        </SortableTh>
                        <SortableTh sortKey="FullName" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            <Text fw={700} size="sm" c="dimmed">Nume Complet</Text>
                        </SortableTh>
                        <SortableTh sortKey="Email" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            <Text fw={700} size="sm" c="dimmed">Email</Text>
                        </SortableTh>
                        <SortableTh sortKey="PhoneNumber" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            <Text fw={700} size="sm" c="dimmed">Telefon</Text>
                        </SortableTh>
                        <SortableTh sortKey="CreatedAt" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            <Text fw={700} size="sm" c="dimmed">Dată Înregistrare</Text>
                        </SortableTh>
                        <SortableTh width={120}>
                            <Center><Text fw={700} size="sm" c="dimmed">Acțiuni</Text></Center>
                        </SortableTh>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {students.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={6}>
                                <Text ta="center" c="dimmed" py="xl">
                                    Nu există studenți înregistrați
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        students.map((student) => (
                            <Table.Tr key={student.id}>
                                <Table.Td>
                                    <Badge variant="light" color="gray" radius="sm" tt="unset" style={{ fontFamily: 'monospace' }}>
                                        {student.studentCode}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Text fw={600} size="sm">{student.fullName}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">
                                        {student.email}
                                    </Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">{student.phoneNumber}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">{formatDate(student.createdAt)}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap={4} justify="center" wrap="nowrap">
                                        <Tooltip label="Vizualizare">
                                            <ActionIcon
                                                variant="subtle"
                                                color="blue"
                                                size="sm"
                                                onClick={() => onView(student.id)}
                                            >
                                                <Eye size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="Editare">
                                            <ActionIcon
                                                variant="subtle"
                                                color="yellow"
                                                size="sm"
                                                onClick={() => onEdit(student.id)}
                                            >
                                                <Pencil size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="Ștergere">
                                            <ActionIcon
                                                variant="subtle"
                                                color="red"
                                                size="sm"
                                                onClick={() => onDelete({ id: student.id, fullName: student.fullName })}
                                            >
                                                <Trash2 size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    )}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
