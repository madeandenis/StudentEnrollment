import { Paper, Title, Stack, Table, Text, Badge, Loader, Center, Group } from '@mantine/core';
import { GraduationCap } from 'lucide-react';
import { useAuth } from '@/features/auth/_contexts/AuthContext';
import { useStudentEnrolledCourses } from '@/features/students/get-enrolled-courses/useStudentEnrolledCourses';
import ErrorAlert from '@/features/_common/components/ErrorAlert';

export function MyCoursesPage() {
    const { user } = useAuth();

    const { data, isLoading, isError, error } = useStudentEnrolledCourses(user?.studentCode);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
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
        <Paper p="md" shadow="sm" withBorder>
            <Stack gap="lg">
                {/* Header */}
                <Group>
                    <GraduationCap size={32} strokeWidth={1.5} />
                    <div>
                        <Title order={2}>Cursurile Mele</Title>
                        <Text size="sm" c="dimmed" mt={4}>
                            Cursurile la care ești înscris
                        </Text>
                    </div>
                </Group>

                {/* Total Credits */}
                <Group>
                    <Badge size="lg" variant="light" color="blue">
                        Total credite acumulate: {totalCredits}
                    </Badge>
                    <Badge size="lg" variant="light" color="gray">
                        Număr cursuri: {enrolledCourses.length}
                    </Badge>
                </Group>

                {/* Courses Table */}
                {enrolledCourses.length === 0 ? (
                    <Text size="sm" c="dimmed" fs="italic" ta="center" py="xl">
                        Nu ești înscris la niciun curs momentan.
                    </Text>
                ) : (
                    <Table striped highlightOnHover withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Cod Curs</Table.Th>
                                <Table.Th>Nume Curs</Table.Th>
                                <Table.Th>Credite</Table.Th>
                                <Table.Th>Data Înscrierii</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {enrolledCourses.map((course) => (
                                <Table.Tr key={course.code}>
                                    <Table.Td>
                                        <Badge variant="light" color="blue" size="lg">
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
                                        <Text size="sm" c="dimmed">
                                            {formatDate(course.enrollmentDate)}
                                        </Text>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                )}

                {/* Summary */}
                {enrolledCourses.length > 0 && (
                    <Paper p="md" withBorder bg="gray.0">
                        <Stack gap="xs">
                            <Text size="sm" fw={500}>
                                Rezumat Academic
                            </Text>
                            <Group>
                                <Text size="sm" c="dimmed">
                                    Total cursuri înscrise: <strong>{enrolledCourses.length}</strong>
                                </Text>
                                <Text size="sm" c="dimmed">
                                    Total credite: <strong>{totalCredits}</strong>
                                </Text>
                            </Group>
                        </Stack>
                    </Paper>
                )}
            </Stack>
        </Paper>
    );
}
