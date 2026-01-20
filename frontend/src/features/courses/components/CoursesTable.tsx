import { Table, Text, ActionIcon, Group, Tooltip, Badge, Center } from '@mantine/core';
import { Eye, Pencil, Trash2, UserPlus } from 'lucide-react';
import type { CourseResponse } from '@/features/courses/_common/types';
import type { AssignedCourseResponse } from '@/features/professors/get-assigned-courses/types';
import { SortableTh } from '@/features/_common/components/SortableTh';
import { useNavigate } from '@tanstack/react-router';

type TableCourse = CourseResponse | AssignedCourseResponse;

interface CoursesTableProps {
    courses: TableCourse[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: ({ id, name }: { id: number; name: string }) => void;
    onSort?: (column: string) => void;
    isProfessor?: boolean;
    isAdmin?: boolean;
    userCode?: string | null;
    onAssignSelf?: (id: number) => void;
    onUnassignSelf?: (id: number) => void;
}

export function CoursesTable({
    courses,
    sortBy,
    sortOrder,
    onView,
    onEdit,
    onDelete,
    onSort,
    isProfessor,
    isAdmin,
    userCode,
    onAssignSelf,
    onUnassignSelf
}: CoursesTableProps) {
    const navigate = useNavigate();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    // Check if any course has professor info to decide whether to show the column
    const showProfessorColumn = courses.some(c => 'professor' in c && c.professor !== null);

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
                        {showProfessorColumn && (
                            <SortableTh sortKey="ProfessorName" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                                Profesor
                            </SortableTh>
                        )}
                        <SortableTh sortKey="CreatedAt" sortBy={sortBy} sortOrder={sortOrder} onSort={onSort}>
                            Data Creării
                        </SortableTh>
                        <SortableTh width={140}>
                            <Center>Acțiuni</Center>
                        </SortableTh>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {courses.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={showProfessorColumn ? 8 : 7}>
                                <Text ta="center" c="dimmed" py="xl">
                                    Nu există cursuri înregistrate
                                </Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        courses.map((course) => {
                            // Normalize fields
                            const id = 'id' in course ? course.id : (course as AssignedCourseResponse).courseId;
                            const code = 'courseCode' in course ? course.courseCode : (course as AssignedCourseResponse).code;
                            const professor = 'professor' in course ? course.professor : undefined;

                            return (
                                <Table.Tr key={id}>
                                    <Table.Td>
                                        <Badge variant="light" color="blue">
                                            {code}
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
                                    {showProfessorColumn && (
                                        <Table.Td>
                                            {professor ? (
                                                <Badge
                                                    variant="light"
                                                    color={isProfessor && professor.code === userCode ? "teal" : "cyan"}
                                                    style={{ cursor: isAdmin ? 'pointer' : 'default' }}
                                                    onClick={(e) => {
                                                        if (!isAdmin) return;
                                                        e.stopPropagation();
                                                        navigate({ to: `/professors/${professor.id}` });
                                                    }}
                                                >
                                                    {isProfessor && professor.code === userCode ? "Tu" : professor.name}
                                                </Badge>
                                            ) : (
                                                <Text size="sm" c="dimmed" fs="italic">
                                                    Neasignat
                                                </Text>
                                            )}
                                        </Table.Td>
                                    )}
                                    <Table.Td>
                                        <Text size="sm">{formatDate(course.createdAt)}</Text>
                                    </Table.Td>
                                    <Table.Td>
                                        <Group gap="xs" justify="center" wrap="nowrap">
                                            <Tooltip label="Vizualizare">
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="blue"
                                                    onClick={() => onView(id)}
                                                >
                                                    <Eye size={18} />
                                                </ActionIcon>
                                            </Tooltip>

                                            {isAdmin && (
                                                <>
                                                    <Tooltip label="Editare">
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="yellow"
                                                            onClick={() => onEdit(id)}
                                                        >
                                                            <Pencil size={18} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="Ștergere">
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="red"
                                                            onClick={() => onDelete({ id, name: course.name })}
                                                        >
                                                            <Trash2 size={18} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </>
                                            )}

                                            {/* Logic for Assigning: Only show if it's a CourseResponse (has 'professor' key) and professor is null */}
                                            {isProfessor && onAssignSelf && ('professor' in course) && !(course as CourseResponse).professor && (
                                                <Tooltip label="Preia Cursul">
                                                    <ActionIcon
                                                        variant="light"
                                                        color="teal"
                                                        onClick={() => onAssignSelf(id)}
                                                    >
                                                        <UserPlus size={18} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            )}

                                            {/* Logic for Unassigning:
                                                1. If professor info exists (CourseResponse) and matches userCode
                                                2. OR if professor info does NOT exist (AssignedCourseResponse) - implying it's in the assigned list
                                            */}
                                            {isProfessor && onUnassignSelf && (
                                                ((professor && professor.code === userCode) || !('professor' in course))
                                            ) && (
                                                    <Tooltip label="Renunță la Curs">
                                                        <ActionIcon
                                                            variant="light"
                                                            color="red"
                                                            onClick={() => onUnassignSelf(id)}
                                                        >
                                                            <Trash2 size={18} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                )}

                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            );
                        })
                    )}
                </Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );
}
