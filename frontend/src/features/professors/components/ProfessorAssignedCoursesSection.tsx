import { Paper, Title, Stack, Text, Group, Button, Loader, Center } from '@mantine/core';
import { BookOpen, Plus } from 'lucide-react';
import { useProfessorAssignedCourses } from '@/features/professors/get-assigned-courses/useProfessorAssignedCourses';
import { useModalState } from '@/features/_common/hooks/useModalState';
import { AssignProfessorToCourseModal } from './AssignProfessorToCourseModal';
import { UnassignProfessorFromCourseModal } from './UnassignProfessorFromCourseModal';
import { CoursesTable } from '@/features/courses/components/CoursesTable';
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
                                <Title order={4}>Cursuri Alocate</Title>
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
                                Alocă la Curs
                            </Button>
                        )}
                    </Group>

                    {/* Courses Table */}
                    {assignedCourses.length === 0 ? (
                        <Text size="sm" c="dimmed" fs="italic" ta="center" py="xl">
                            Profesorul nu este alocat la niciun curs.
                        </Text>
                    ) : (
                        <CoursesTable
                            courses={assignedCourses}
                            onView={(id) => handleCourseClick(id)}
                            onEdit={() => { }} // No-op for professor view
                            onDelete={() => { }} // No-op for professor view
                            isProfessor={false}
                            isAdmin={isAdmin}
                        />
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
