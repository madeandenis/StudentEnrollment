import { Table, Text, ActionIcon, Group, Tooltip, Badge, Center } from '@mantine/core';
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
            <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <SortableTh sortKey="StudentCode" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Cod Student
                        </SortableTh>
                        <SortableTh sortKey="FullName" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Nume Complet
                        </SortableTh>
                        <SortableTh sortKey="Email" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Email
                        </SortableTh>
                        <SortableTh sortKey="PhoneNumber" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Telefon
                        </SortableTh>
                        <SortableTh sortKey="CreatedAt" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Data Înregistrării
                        </SortableTh>
                        <SortableTh width={120}>
                            <Center>Acțiuni</Center>
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
                                    <Badge variant="light" color="blue">
                                        {student.studentCode}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Text fw={500}>{student.fullName}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" c="dimmed">
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
                                    <Group gap="xs" justify="center" wrap="nowrap">
                                        <Tooltip label="Vizualizare">
                                            <ActionIcon
                                                variant="subtle"
                                                color="blue"
                                                onClick={() => onView(student.id)}
                                            >
                                                <Eye size={18} />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="Editare">
                                            <ActionIcon
                                                variant="subtle"
                                                color="yellow"
                                                onClick={() => onEdit(student.id)}
                                            >
                                                <Pencil size={18} />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="Ștergere">
                                            <ActionIcon
                                                variant="subtle"
                                                color="red"
                                                onClick={() => onDelete({ id: student.id, fullName: student.fullName })}
                                            >
                                                <Trash2 size={18} />
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
