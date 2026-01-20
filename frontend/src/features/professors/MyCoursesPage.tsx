import { Paper, Title, Stack, Text, Loader, Center, Group, Divider } from '@mantine/core';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/features/auth/_contexts/AuthContext';
import { useProfessorAssignedCourses } from '@/features/professors/get-assigned-courses/useProfessorAssignedCourses';
import { useCourseList } from '@/features/courses/get-list/useCourseList';
import { useAssignProfessor } from '@/features/courses/assign-professor/useAssignProfessor';
import { useUnassignProfessor } from '@/features/courses/unassign-professor/useUnassignProfessor';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import { useNavigate } from '@tanstack/react-router';
import { ConfirmModal } from '@/features/_common/components/ConfirmModal';
import { CoursesTable } from '@/features/courses/components/CoursesTable';
import { useModalState } from '@/features/_common/hooks/useModalState';
import { notifications } from '@mantine/notifications';


interface CourseActionState {
    courseId: number | null;
    courseName: string;
}

export function MyCoursesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Modal states
    const assignModal = useModalState<CourseActionState>();
    const unassignModal = useModalState<CourseActionState>();

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
            assignModal.open({ courseId, courseName: course.name });
        }
    };

    const openUnassignModal = (courseId: number) => {
        const course = assignedData?.assignedCourses.find(c => c.courseId === courseId);
        if (course) {
            unassignModal.open({ courseId, courseName: course.name });
        }
    };

    const handleConfirmAssign = async () => {
        if (!user?.professorCode || !assignModal.item?.courseId) return;

        try {
            await assignMutation.mutateAsync({
                courseId: assignModal.item.courseId,
                professorIdentifier: user.professorCode,
            });
            notifications.show({
                title: 'Succes',
                message: `Ați fost alocat la cursul "${assignModal.item.courseName}" cu succes!`,
                color: 'green',
            });
            assignModal.close();
        } catch (error: any) {
            notifications.show({
                title: 'Eroare',
                message: error?.response?.data?.detail || 'A apărut o eroare la alocarea cursului.',
                color: 'red',
            });
        }
    };

    const handleConfirmUnassign = async () => {
        if (!user?.professorCode || !unassignModal.item?.courseId) return;

        try {
            await unassignMutation.mutateAsync({
                courseId: unassignModal.item.courseId,
                professorIdentifier: user.professorCode,
            });
            notifications.show({
                title: 'Succes',
                message: `Ați renunțat la cursul "${unassignModal.item.courseName}" cu succes.`,
                color: 'green',
            });
            unassignModal.close();
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
            <Paper p="lg" shadow="xs" withBorder bg="white" radius="md">
                <Stack gap="lg">
                    {/* Header */}
                    <Group justify="space-between" align="flex-start">
                        <Group>
                            <BookOpen size={24} className="text-gray-400" />
                            <div>
                                <Title order={3} c="dark.4">Activitatea ta didactică</Title>
                                <Text size="sm" c="dimmed">
                                    Gestionezi <Text span fw={700} c="black">{assignedCourses.length}</Text> cursuri cu un total de <Text span fw={700} c="black">{totalStudents}</Text> studenți înscriși.
                                </Text>
                            </div>
                        </Group>
                    </Group>

                    <Divider color="gray.2" />

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
            <Paper p="lg" shadow="xs" withBorder bg="white" radius="md">
                <Stack gap="lg">
                    <Group justify="space-between" align="center">
                        <div>
                            <Title order={3} c="dark.4">Cursuri fără titular</Title>
                            <Text size="sm" c="dimmed">
                                Următoarele cursuri nu au încă un profesor alocat. Te poți înscrie ca titular.
                            </Text>
                        </div>
                    </Group>

                    <Divider color="gray.2" />

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
                opened={assignModal.opened}
                onClose={assignModal.close}
                onConfirm={handleConfirmAssign}
                title="Preluare Curs"
                description={(name) => `Ești sigur că vrei să preiei cursul "${name}"?`}
                item={assignModal.item?.courseName || ''}
                confirmLabel="Preia Cursul"
                isLoading={assignMutation.isPending}
            />

            <ConfirmModal
                opened={unassignModal.opened}
                onClose={unassignModal.close}
                onConfirm={handleConfirmUnassign}
                title="Renunțare Curs"
                description={(name) => `Ești sigur că vrei să renunți la cursul "${name}"? Această acțiune nu poate fi anulată.`}
                item={unassignModal.item?.courseName || ''}
                confirmLabel="Renunță"
                isLoading={unassignMutation.isPending}
            />
        </Stack>
    );
}
