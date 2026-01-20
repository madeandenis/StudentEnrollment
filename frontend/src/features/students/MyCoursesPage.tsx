import { Paper, Title, Text, Group, Loader, Center } from '@mantine/core';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '@/features/auth/_contexts/AuthContext';
import { useNavigate } from '@tanstack/react-router';
import { useStudentEnrolledCourses } from '@/features/students/get-enrolled-courses/useStudentEnrolledCourses';
import { EnrolledCoursesTable } from '@/features/students/components/EnrolledCoursesTable';
import ErrorAlert from '@/features/_common/components/ErrorAlert';

export function MyCoursesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data, isLoading, isError, error } = useStudentEnrolledCourses(user?.studentCode);

    const handleViewCourse = (courseId: number) => {
        navigate({ to: `/courses/${courseId}` });
    };

    // If user is not a student
    if (!user?.studentCode) {
        return (
            <Paper p="md" shadow="sm" withBorder>
                <ErrorAlert
                    errors="Nu ești înregistrat ca student. Contactează administrația pentru mai multe informații."
                    onClose={() => { }}
                />
            </Paper>
        );
    }

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

    const enrolledCourses = data?.enrolledCourses || [];
    const totalCredits = data?.totalCreditsAccumulated || 0;

    return (
        <Paper p="lg" shadow="xs" withBorder bg="white" radius="md">
            <Group mb="lg">
                <GraduationCap size={24} className="text-gray-400" />
                <div>
                    <Title order={3} c="dark.4">Cursurile Mele</Title>
                    <Text size="sm" c="dimmed">
                        Total credite acumulate: <strong>{totalCredits}</strong>
                    </Text>
                </div>
            </Group>

            {enrolledCourses.length === 0 ? (
                <Text size="sm" c="dimmed" fs="italic" ta="center" py="xl">
                    Nu ești înscris la niciun curs momentan.
                </Text>
            ) : (
                <EnrolledCoursesTable
                    courses={enrolledCourses}
                    onViewCourse={handleViewCourse}
                    isAdmin={false}
                />
            )}
        </Paper>
    );
}
