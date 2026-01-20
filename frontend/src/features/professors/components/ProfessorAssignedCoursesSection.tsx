import { Paper, Title, Stack, Table, Text, Badge, Group, Button, Loader, Center, ActionIcon, Tooltip } from '@mantine/core';
import { BookOpen, Plus, X } from 'lucide-react';
import { useProfessorAssignedCourses } from '@/features/professors/get-assigned-courses/useProfessorAssignedCourses';
import { useModalState } from '@/features/_common/hooks/useModalState';
import { AssignProfessorToCourseModal } from './AssignProfessorToCourseModal';
import { UnassignProfessorFromCourseModal } from './UnassignProfessorFromCourseModal';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import type { AssignedCourseResponse } from '@/features/professors/get-assigned-courses/types';
import { useAuth } from '@/features/auth/_contexts/AuthContext';
import { useNavigate } from '@tanstack/react-router';

interface ProfessorAssignedCoursesSectionProps {
    professorId: number;
    professorName: string;
    professorCode: string;
}

export function ProfessorAssignedCoursesSection({
    professorId,
    professorName,
    professorCode,
}: ProfessorAssignedCoursesSectionProps) {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useProfessorAssignedCourses(professorId);
    const assignModal = useModalState();
    const unassignModal = useModalState<AssignedCourseResponse>();

    const handleUnassignClick = (course: AssignedCourseResponse) => {
        unassignModal.open(course);
    };

    const handleCourseClick = (courseId: number) => {
        navigate({ to: `/courses/${courseId}` });
    };

    if (isLoading) {
        return (
            <Paper p="md" shadow="sm" withBorder>
                <Center py="xl">
                    <Loader size="lg" />
                </Center>
            </Paper>
        );
    }

    if (isError) {
        return (
            <Paper p="md" shadow="sm" withBorder>
                <ErrorAlert
                    errors={error?.message || 'Nu s-a putut încărca cursurile profesorului'}
                    onClose={() => { }}
                />
            </Paper>
        );
    }

    const assignedCourses = data?.assignedCourses || [];
    const totalCourses = data?.totalCourses || 0;
    const totalStudents = data?.totalStudents || 0;

    return (
        <>
            <Paper p="md" shadow="sm" withBorder>
                <Stack gap="lg">
                    {/* Header */}
                    <Group justify="space-between">
                        <Group>
                            <BookOpen size={24} strokeWidth={1.5} />
                            <div>
                                <Title order={4}>Cursuri Asignate</Title>
                                <Text size="sm" c="dimmed">
                                    Total cursuri: <strong>{totalCourses}</strong> • Total studenți: <strong>{totalStudents}</strong>
                                </Text>
                            </div>
                        </Group>
                        {isAdmin && (
                            <Button
                                leftSection={<Plus size={18} />}
                                onClick={() => assignModal.open()}
                            >
                                Asignează la Curs
                            </Button>
                        )}
                    </Group>

                    {/* Courses Table */}
                    {assignedCourses.length === 0 ? (
                        <Text size="sm" c="dimmed" fs="italic" ta="center" py="xl">
                            Profesorul nu este asignat la niciun curs.
                        </Text>
                    ) : (
                        <Table striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Cod</Table.Th>
                                    <Table.Th>Nume</Table.Th>
                                    <Table.Th>Credite</Table.Th>
                                    <Table.Th>Studenți Înscriși</Table.Th>
                                    <Table.Th>Locuri Disponibile</Table.Th>
                                    {isAdmin && <Table.Th style={{ width: '80px' }}>Acțiuni</Table.Th>}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {assignedCourses.map((course) => (
                                    <Table.Tr
                                        key={course.courseId}
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleCourseClick(course.courseId)}
                                    >
                                        <Table.Td>
                                            <Badge variant="light" color="blue">
                                                {course.code}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" fw={500}>
                                                {course.name}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="outline" color="gray">
                                                {course.credits} credite
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm">
                                                {course.enrolledStudents} / {course.maxEnrollment}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Text size="sm">
                                                    {course.availableSeats}
                                                </Text>
                                                {course.hasAvailableSeats ? (
                                                    <Badge variant="light" color="green" size="sm">
                                                        Disponibil
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="light" color="red" size="sm">
                                                        Complet
                                                    </Badge>
                                                )}
                                            </Group>
                                        </Table.Td>
                                        {isAdmin && (
                                            <Table.Td onClick={(e) => e.stopPropagation()}>
                                                <Tooltip label="Dezasignează de la curs">
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="red"
                                                        onClick={() => handleUnassignClick(course)}
                                                        aria-label="Dezasignează de la curs"
                                                    >
                                                        <X size={18} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Table.Td>
                                        )}
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    )}
                </Stack>
            </Paper>

            {/* Assign Modal */}
            {isAdmin && (
                <AssignProfessorToCourseModal
                    opened={assignModal.opened}
                    professorId={professorId}
                    professorName={professorName}
                    professorCode={professorCode}
                    onClose={assignModal.close}
                />
            )}

            {/* Unassign Modal */}
            {isAdmin && unassignModal.opened && unassignModal.item && (
                <UnassignProfessorFromCourseModal
                    opened={unassignModal.opened}
                    professorId={professorId}
                    professorName={professorName}
                    professorCode={professorCode}
                    courseId={unassignModal.item.courseId}
                    courseCode={unassignModal.item.code}
                    courseName={unassignModal.item.name}
                    onClose={unassignModal.close}
                />
            )}
        </>
    );
}
