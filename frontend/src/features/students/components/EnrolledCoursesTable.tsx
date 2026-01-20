import { Table, Text, ActionIcon, Group, Tooltip, Badge, Center } from '@mantine/core';
import { X, Eye } from 'lucide-react';
import type { EnrolledCourseResponse } from '@/features/students/get-enrolled-courses/types';

interface EnrolledCoursesTableProps {
    courses: EnrolledCourseResponse[];
    onWithdraw?: (course: EnrolledCourseResponse) => void;
    onViewCourse?: (courseId: number) => void;
    isAdmin?: boolean;
}

export function EnrolledCoursesTable({
    courses,
    onWithdraw,
    onViewCourse,
    isAdmin
}: EnrolledCoursesTableProps) {
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
                        <Table.Th style={{ width: 140 }}>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed">Cod</Text>
                        </Table.Th>
                        <Table.Th>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed">Nume</Text>
                        </Table.Th>
                        <Table.Th>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed">Credite</Text>
                        </Table.Th>
                        <Table.Th>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed">Notă</Text>
                        </Table.Th>
                        <Table.Th>
                            <Text size="xs" fw={600} tt="uppercase" c="dimmed">Data Înscrierii</Text>
                        </Table.Th>
                        <Table.Th style={{ width: 80 }}>
                            <Center><Text size="xs" fw={600} tt="uppercase" c="dimmed">Acțiuni</Text></Center>
                        </Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {courses.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={6}>
                                <Text ta="center" c="dimmed" py="xl">
                                    Nu există cursuri înregistrate
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        courses.map((course) => (
                            <Table.Tr key={course.code}>
                                <Table.Td>
                                    <Badge
                                        variant="light"
                                        color="gray"
                                        size="md"
                                        radius="sm"
                                        styles={{ root: { textTransform: 'none', fontFamily: 'monospace' } }}
                                    >
                                        {course.code}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    <Text size="sm" fw={500}>{course.name}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Badge variant="light" color="blue" size="md" radius="sm">
                                        {course.credits}
                                    </Badge>
                                </Table.Td>
                                <Table.Td>
                                    {course.grade !== undefined && course.grade !== null ? (
                                        <Group gap="xs">
                                            <Badge variant="light" color={course.grade >= 5 ? 'green' : 'red'} size="md" radius="sm">
                                                {course.grade.toFixed(2)}
                                            </Badge>
                                            {course.assignedByProfessor && (
                                                <Tooltip label={`Atribuită de: ${course.assignedByProfessor}`}>
                                                    <Text size="xs" c="dimmed">
                                                        ({course.assignedByProfessor.split(' ').map(n => n[0]).join('.')})
                                                    </Text>
                                                </Tooltip>
                                            )}
                                        </Group>
                                    ) : (
                                        <Text size="sm" c="dimmed" fs="italic">
                                            Fără notă
                                        </Text>
                                    )}
                                </Table.Td>
                                <Table.Td>
                                    <Text size="xs" c="dimmed">{formatDate(course.enrollmentDate)}</Text>
                                </Table.Td>
                                <Table.Td>
                                    <Group gap={4} justify="center" wrap="nowrap">
                                        <Tooltip label="Vizualizare">
                                            <ActionIcon
                                                variant="subtle"
                                                color="blue"
                                                size="sm"
                                                onClick={() => onViewCourse?.(course.courseId)}
                                                aria-label="Vizualizare curs"
                                            >
                                                <Eye size={16} />
                                            </ActionIcon>
                                        </Tooltip>
                                        {isAdmin && (
                                            <Tooltip label="Renunță la curs">
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="red"
                                                    size="sm"
                                                    onClick={() => onWithdraw?.(course)}
                                                    aria-label="Renunță la curs"
                                                >
                                                    <X size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
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
