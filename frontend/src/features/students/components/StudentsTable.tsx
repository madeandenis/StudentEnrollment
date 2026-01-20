import { Table, Text, ActionIcon, Group, Tooltip, Center, Badge, Anchor } from '@mantine/core';
import { Eye, Pencil, Trash2, UserPlus } from 'lucide-react';
import type { StudentResponse } from '@/features/students/_common/types';
import { SortableTh } from '@/features/_common/components/SortableTh';

interface StudentsTableProps {
    students: StudentResponse[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: ({ id, fullName }: { id: number; fullName: string }) => void;
    onEnroll?: (student: StudentResponse) => void;
    onSort?: (column: string) => void;
    isAdmin?: boolean;
}

export function StudentsTable({
    students,
    sortBy,
    sortOrder,
    onView,
    onEdit,
    onDelete,
    onEnroll,
    onSort,
    isAdmin
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
            <Table verticalSpacing="md" horizontalSpacing="md" withTableBorder highlightOnHover>
                <Table.Thead bg="gray.0">
                    <Table.Tr>
                        <SortableTh sortKey="StudentCode" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort} width={140}>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed">Cod</Text>
                        </SortableTh>
                        <SortableTh sortKey="FullName" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed">Nume Complet</Text>
                        </SortableTh>
                        <SortableTh sortKey="Email" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed">Email</Text>
                        </SortableTh>
                        <SortableTh sortKey="PhoneNumber" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed">Telefon</Text>
                        </SortableTh>
                        <SortableTh sortKey="CreatedAt" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed">Dată Creare</Text>
                        </SortableTh>
                        <SortableTh width={isAdmin && onEnroll ? 160 : 120}>
                            <Center><Text size="xs" fw={600} tt="uppercase" c="dimmed">Acțiuni</Text></Center>
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
                                    <Badge
                                        variant="light"
                                        color="gray"
                                        size="md"
                                        radius="sm"
                                        styles={{ root: { textTransform: 'none', fontFamily: 'monospace' } }}
                                    >
                                        {student.studentCode}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" fw={500}>{student.fullName}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Anchor
                                        href={`mailto:${student.email}`}
                                        size="sm"
                                        c="violet"
                                        td="underline"
                                    >
                                        {student.email}
                                    </Anchor>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">{student.phoneNumber}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="xs" c="dimmed">{formatDate(student.createdAt)}</Text>
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
                                        {isAdmin && onEnroll && (
                                            <Tooltip label="Înscrie la Curs">
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="green"
                                                    size="sm"
                                                    onClick={() => onEnroll(student)}
                                                >
                                                    <UserPlus size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
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
