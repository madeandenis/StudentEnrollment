import { Table, Text, ActionIcon, Group, Tooltip, Badge, Center } from '@mantine/core';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import type { CourseResponse } from '@/features/courses/_common/types';
import { SortableTh } from '@/features/_common/components/SortableTh';
import { useNavigate } from '@tanstack/react-router';

interface CoursesTableProps {
    courses: CourseResponse[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: ({ id, name }: { id: number; name: string }) => void;
    onSort?: (column: string) => void;
}

export function CoursesTable({
    courses,
    sortBy,
    sortOrder,
    onView,
    onEdit,
    onDelete,
    onSort
}: CoursesTableProps) {
    const navigate = useNavigate();

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
                        <SortableTh sortKey="CourseCode" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Cod Curs
                        </SortableTh>
                        <SortableTh sortKey="Name" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Nume Curs
                        </SortableTh>
                        <SortableTh sortKey="Credits" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Credite
                        </SortableTh>
                        <SortableTh sortKey="MaxEnrollment" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Capacitate
                        </SortableTh>
                        <SortableTh sortKey="EnrolledStudents" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Înscriși
                        </SortableTh>
                        <SortableTh sortKey="ProfessorName" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Profesor
                        </SortableTh>
                        <SortableTh sortKey="CreatedAt" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Data Creării
                        </SortableTh>
                        <SortableTh width={120}>
                            <Center>Acțiuni</Center>
                        </SortableTh>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {courses.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={8}>
                                <Text ta="center" c="dimmed" py="xl">
                                    Nu există cursuri înregistrate
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        courses.map((course) => (
                            <Table.Tr key={course.id}>
                                <Table.Td>
                                    <Badge variant="light" color="blue">
                                        {course.courseCode}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Text fw={500}>{course.name}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Badge variant="light" color="grape">
                                        {course.credits} {course.credits === 1 ? 'credit' : 'credite'}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">{course.maxEnrollment}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs">
                                        <Text size="sm" fw={500}>
                                            {course.enrolledStudents}
                                        </Text>
                                        {course.hasAvailableSeats ? (
                                            <Badge variant="light" color="green" size="sm">
                                                {course.availableSeats} locuri
                                            </Badge>
                                        ) : (
                                            <Badge variant="light" color="red" size="sm">
                                                Complet
                                            </Badge>
                                        )}
                                    </Group>
                                </Table.Td>
                                <Table.Td>
                                    {course.professor ? (
                                        <Badge
                                            variant="light"
                                            color="cyan"
                                            style={{ cursor: 'pointer' }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate({ to: `/professors/${course.professor!.id}` });
                                            }}
                                        >
                                            {course.professor.name}
                                        </Badge>
                                    ) : (
                                        <Text size="sm" c="dimmed" fs="italic">
                                            Neasignat
                                        </Text>
                                    )}
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm">{formatDate(course.createdAt)}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap="xs" justify="center" wrap="nowrap">
                                        <Tooltip label="Vizualizare">
                                            <ActionIcon
                                                variant="subtle"
                                                color="blue"
                                                onClick={() => onView(course.id)}
                                            >
                                                <Eye size={18} />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="Editare">
                                            <ActionIcon
                                                variant="subtle"
                                                color="yellow"
                                                onClick={() => onEdit(course.id)}
                                            >
                                                <Pencil size={18} />
                                            </ActionIcon>
                                        </Tooltip>
                                        <Tooltip label="Ștergere">
                                            <ActionIcon
                                                variant="subtle"
                                                color="red"
                                                onClick={() => onDelete({ id: course.id, name: course.name })}
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
