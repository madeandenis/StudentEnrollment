import { Paper, Title, Stack, Text, Badge, Loader, Center, Group, Divider } from '@mantine/core';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/features/auth/_contexts/AuthContext';
import { useProfessorAssignedCourses } from '@/features/professors/get-assigned-courses/useProfessorAssignedCourses';
import { useCourseList } from '@/features/courses/get-list/useCourseList';
import { useAssignProfessor } from '@/features/courses/assign-professor/useAssignProfessor';
import { useUnassignProfessor } from '@/features/courses/unassign-professor/useUnassignProfessor';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ConfirmModal } from '@/features/_common/components/ConfirmModal';
import { CoursesTable } from '@/features/courses/components/CoursesTable';

interface CourseActionState {
    courseId: number | null;
    courseName: string;
}

export function MyCoursesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Modal states
    const [assignModal, setAssignModal] = useState<CourseActionState>({ courseId: null, courseName: '' });
    const [unassignModal, setUnassignModal] = useState<CourseActionState>({ courseId: null, courseName: '' });
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isUnassignModalOpen, setIsUnassignModalOpen] = useState(false);

    // Fetch professor's assigned courses using professorCode
    const { data: assignedData, isLoading: isLoadingAssigned, isError: isErrorAssigned, error: errorAssigned } = useProfessorAssignedCourses(user?.professorCode);

    // Fetch available courses (without assigned professor)
    const { data: availableData, isLoading: isLoadingAvailable, isError: isErrorAvailable, error: errorAvailable } = useCourseList({
        PageIndex: 1,
        PageSize: 100,
        HasAssignedProfessor: false,
    });

    const assignMutation = useAssignProfessor();
    const unassignMutation = useUnassignProfessor();

    const openAssignModal = (courseId: number) => {
        const course = availableData?.items.find(c => c.id === courseId);
        if (course) {
            setAssignModal({ courseId, courseName: course.name });
            setIsAssignModalOpen(true);
        }
    };

    const openUnassignModal = (courseId: number) => {
        const course = assignedData?.assignedCourses.find(c => c.courseId === courseId);
        if (course) {
            setUnassignModal({ courseId, courseName: course.name });
            setIsUnassignModalOpen(true);
        }
    };

    const handleConfirmAssign = async () => {
        if (!user?.professorCode || !assignModal.courseId) return;

        try {
            await assignMutation.mutateAsync({
                courseId: assignModal.courseId,
                professorIdentifier: user.professorCode,
            });
            notifications.show({
                title: 'Succes',
                message: `Ați fost asignat la cursul "${assignModal.courseName}" cu succes!`,
                color: 'green',
            });
            setIsAssignModalOpen(false);
        } catch (error: any) {
            notifications.show({
                title: 'Eroare',
                message: error?.response?.data?.detail || 'A apărut o eroare la asignarea cursului.',
                color: 'red',
            });
        }
    };

    const handleConfirmUnassign = async () => {
        if (!user?.professorCode || !unassignModal.courseId) return;

        try {
            await unassignMutation.mutateAsync({
                courseId: unassignModal.courseId,
                professorIdentifier: user.professorCode,
            });
            notifications.show({
                title: 'Succes',
                message: `Ați renunțat la cursul "${unassignModal.courseName}" cu succes.`,
                color: 'green',
            });
            setIsUnassignModalOpen(false);
        } catch (error: any) {
            notifications.show({
                title: 'Eroare',
                message: error?.response?.data?.detail || 'A apărut o eroare la renunțarea cursului.',
                color: 'red',
            });
        }
    };

    // If user is not a professor
    if (!user?.professorCode) {
        return (
            <Paper p="md" shadow="sm" withBorder>
                <ErrorAlert
                    errors="Nu ești înregistrat ca profesor. Contactează administrația pentru mai multe informații."
                    onClose={() => { }}
                />
            </Paper>
        );
    }

    const isLoading = isLoadingAssigned || isLoadingAvailable;
    const isError = isErrorAssigned || isErrorAvailable;
    const error = errorAssigned || errorAvailable;

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
                    errors={error?.message || 'Nu s-au putut încărca cursurile'}
                    onClose={() => { }}
                />
            </Paper>
        );
    }

    const assignedCourses = assignedData?.assignedCourses || [];
    const totalStudents = assignedData?.totalStudents || 0;
    const availableCourses = availableData?.items || [];

    return (
        <Stack gap="lg">
            {/* My Assigned Courses Section */}
            <Paper p="md" shadow="sm" withBorder>
                <Stack gap="lg">
                    {/* Header */}
                    <Group>
                        <BookOpen size={32} strokeWidth={1.5} />
                        <div>
                            <Title order={2}>Cursurile Mele</Title>
                            <Text size="sm" c="dimmed" mt={4}>
                                Cursurile la care ești asignat ca profesor
                            </Text>
                        </div>
                    </Group>

                    {/* Summary */}
                    <Group>
                        <Badge size="lg" variant="light" color="blue">
                            Total cursuri: {assignedCourses.length}
                        </Badge>
                        <Badge size="lg" variant="light" color="grape">
                            Total studenți: {totalStudents}
                        </Badge>
                    </Group>

                    {/* Assigned Courses Table */}
                    <CoursesTable
                        courses={assignedCourses}
                        onView={(id) => navigate({ to: `/courses/${id}` })}
                        onEdit={() => { }} // No-op for professor
                        onDelete={() => { }} // No-op for professor
                        isProfessor={true}
                        isAdmin={false}
                        userCode={user.professorCode}
                        onUnassignSelf={openUnassignModal}
                    />
                </Stack>
            </Paper>

            {/* Available Courses Section */}
            <Paper p="md" shadow="sm" withBorder>
                <Stack gap="lg">
                    <div>
                        <Title order={3}>Cursuri Disponibile</Title>
                        <Text size="sm" c="dimmed" mt={4}>
                            Cursuri fără profesor asignat - poți să te asignezi singur
                        </Text>
                    </div>

                    <Divider />

                    <CoursesTable
                        courses={availableCourses}
                        onView={(id) => navigate({ to: `/courses/${id}` })}
                        onEdit={() => { }} // No-op
                        onDelete={() => { }} // No-op
                        isProfessor={true}
                        isAdmin={false}
                        userCode={user.professorCode}
                        onAssignSelf={openAssignModal}
                    />
                </Stack>
            </Paper>

            {/* Confirm Modals */}
            <ConfirmModal
                opened={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                onConfirm={handleConfirmAssign}
                title="Preluare Curs"
                description={(name) => `Ești sigur că vrei să preiei cursul "${name}"? Vei deveni profesorul titular.`}
                item={assignModal.courseName}
                confirmLabel="Preia Cursul"
                isLoading={assignMutation.isPending}
            />

            <ConfirmModal
                opened={isUnassignModalOpen}
                onClose={() => setIsUnassignModalOpen(false)}
                onConfirm={handleConfirmUnassign}
                title="Renunțare Curs"
                description={(name) => `Ești sigur că vrei să renunți la cursul "${name}"? Această acțiune nu poate fi anulată.`}
                item={unassignModal.courseName}
                confirmLabel="Renunță"
                isLoading={unassignMutation.isPending}
            />
        </Stack>
    );
}
