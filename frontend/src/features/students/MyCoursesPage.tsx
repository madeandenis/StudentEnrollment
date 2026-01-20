import { Paper, Title, Stack, Table, Text, Badge, Loader, Center, Group, Divider, ActionIcon, Tooltip } from '@mantine/core';
import { GraduationCap, Eye } from 'lucide-react';
import { useAuth } from '@/features/auth/_contexts/AuthContext';
import { useStudentEnrolledCourses } from '@/features/students/get-enrolled-courses/useStudentEnrolledCourses';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import { useNavigate } from '@tanstack/react-router';

export function MyCoursesPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

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
        <Stack gap="lg">
            <Paper p="lg" shadow="xs" withBorder bg="white" radius="md">
                <Stack gap="lg">
                    {/* Header */}
                    <Group justify="space-between" align="flex-start">
                        <Group>
                            <GraduationCap size={24} className="text-gray-400" />
                            <div>
                                <Title order={3} c="dark.4">Cursurile Mele</Title>
                                <Text size="sm" c="dimmed">
                                    Lista cursurilor la care ești înscris în prezent
                                </Text>
                            </div>
                        </Group>
                    </Group>

                    <Divider color="gray.2" />

                    {/* Courses Table */}
                    <Table.ScrollContainer minWidth={800}>
                        <Table verticalSpacing="sm" withTableBorder highlightOnHover>
                            <Table.Thead bg="gray.0">
                                <Table.Tr>
                                    <Table.Th><Text fw={700} size="sm" c="dimmed">Cod Curs</Text></Table.Th>
                                    <Table.Th><Text fw={700} size="sm" c="dimmed">Nume Curs</Text></Table.Th>
                                    <Table.Th><Text fw={700} size="sm" c="dimmed">Credite</Text></Table.Th>
                                    <Table.Th><Text fw={700} size="sm" c="dimmed">Data Înscrierii</Text></Table.Th>
                                    <Table.Th><Text fw={700} size="sm" c="dimmed"></Text></Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {enrolledCourses.length === 0 ? (
                                    <Table.Tr>
                                        <Table.Td colSpan={5}>
                                            <Text size="sm" c="dimmed" fs="italic" ta="center" py="xl">
                                                Nu ești înscris la niciun curs momentan.
                                            </Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ) : (
                                    enrolledCourses.map((course) => (
                                        <Table.Tr key={course.code}>
                                            <Table.Td>
                                                <Badge variant="light" color="gray" radius="sm" tt="unset" style={{ fontFamily: 'monospace' }}>
                                                    {course.code}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm" fw={600}>
                                                    {course.name}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Badge variant="light" color="gray" size="sm" radius="sm">
                                                    {course.credits} credite
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>
                                                <Text size="sm">
                                                    {formatDate(course.enrollmentDate)}
                                                </Text>
                                            </Table.Td>
                                            <Table.Td>
                                                <Center>
                                                    <Tooltip label="Vizualizare detalii curs">
                                                        <ActionIcon
                                                            variant="subtle"
                                                            color="blue"
                                                            size="sm"
                                                            onClick={() => navigate({ to: `/courses/${course.courseId}` })}
                                                        >
                                                            <Eye size={16} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                </Center>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))
                                )}
                                {/* Summary Row */}
                                {enrolledCourses.length > 0 && (
                                    <Table.Tr bg="gray.0">
                                        <Table.Td>
                                            <Text size="sm" fw={700} c="dimmed">Total</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" fw={700}>{enrolledCourses.length} cursuri</Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Badge variant="light" size="sm" radius="sm">
                                                {totalCredits} credite
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td />
                                        <Table.Td />
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </Stack>
            </Paper>
        </Stack>
    );
}
