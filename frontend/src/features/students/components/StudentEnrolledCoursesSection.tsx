import { Paper, Title, Stack, Table, Text, Badge, Group, Button, Loader, Center, ActionIcon, Tooltip } from '@mantine/core';
import { GraduationCap, Plus, X } from 'lucide-react';
import { useStudentEnrolledCourses } from '@/features/students/get-enrolled-courses/useStudentEnrolledCourses';
import { useModalState } from '@/features/_common/hooks/useModalState';
import { EnrollStudentModal } from './EnrollStudentModal';
import { WithdrawCourseModal } from './WithdrawCourseModal';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import type { EnrolledCourseResponse } from '@/features/students/get-enrolled-courses/types';
import { useAuth } from '@/features/auth/_contexts/AuthContext';

interface StudentEnrolledCoursesSectionProps {
    studentId: number;
    studentName: string;
}

export function StudentEnrolledCoursesSection({
    studentId,
    studentName,
}: StudentEnrolledCoursesSectionProps) {
    const { isAdmin } = useAuth();

    const { data, isLoading, isError, error } = useStudentEnrolledCourses(studentId);
    const enrollModal = useModalState();
    const withdrawModal = useModalState<EnrolledCourseResponse>();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleWithdrawClick = (course: EnrolledCourseResponse) => {
        withdrawModal.open(course);
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
                    errors={error?.message || 'Nu s-a putut încărca cursurile studentului'}
                    onClose={() => { }}
                />
            </Paper>
        );
    }

    const enrolledCourses = data?.enrolledCourses || [];
    const totalCredits = data?.totalCreditsAccumulated || 0;

    return (
        <>
            <Paper p="md" shadow="sm" withBorder>
                <Stack gap="lg">
                    {/* Header */}
                    <Group justify="space-between">
                        <Group>
                            <GraduationCap size={24} strokeWidth={1.5} />
                            <div>
                                <Title order={4}>Cursuri Înscrise</Title>
                                <Text size="sm" c="dimmed">
                                    Total credite acumulate: <strong>{totalCredits}</strong>
                                </Text>
                            </div>
                        </Group>
                        {isAdmin && (
                            <Button
                                leftSection={<Plus size={18} />}
                                onClick={() => enrollModal.open()}
                            >
                                Înscrie la Curs
                            </Button>
                        )}
                    </Group>

                    {/* Courses Table */}
                    {enrolledCourses.length === 0 ? (
                        <Text size="sm" c="dimmed" fs="italic" ta="center" py="xl">
                            Studentul nu este înscris la niciun curs.
                        </Text>
                    ) : (
                        <Table striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Cod</Table.Th>
                                    <Table.Th>Nume</Table.Th>
                                    <Table.Th>Credite</Table.Th>
                                    <Table.Th>Notă</Table.Th>
                                    <Table.Th>Data Înscrierii</Table.Th>
                                    {isAdmin && <Table.Th style={{ width: '80px' }}>Acțiuni</Table.Th>}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {enrolledCourses.map((course) => (
                                    <Table.Tr key={course.code}>
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
                                            {course.grade !== undefined && course.grade !== null ? (
                                                <Group gap="xs">
                                                    <Badge variant="light" color={course.grade >= 5 ? 'green' : 'red'}>
                                                        {course.grade.toFixed(2)}
                                                    </Badge>
                                                    {course.assignedByProfessor && (
                                                        <Tooltip label={`Asignată de: ${course.assignedByProfessor}`}>
                                                            <Text size="xs" c="dimmed">
                                                                ({course.assignedByProfessor.split(' ').map(n => n[0]).join('.')})
                                                            </Text>
                                                        </Tooltip>
                                                    )}
                                                </Group>
                                            ) : (
                                                <Text size="sm" c="dimmed" fs="italic">
                                                    Neasignată
                                                </Text>
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {formatDate(course.enrollmentDate)}
                                            </Text>
                                        </Table.Td>
                                        {isAdmin && (
                                            <Table.Td>
                                                <Tooltip label="Renunță la curs">
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="red"
                                                        onClick={() => handleWithdrawClick(course)}
                                                        aria-label="Renunță la curs"
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

            {/* Enroll Modal */}
            {isAdmin && (
                <EnrollStudentModal
                    opened={enrollModal.opened}
                    studentId={studentId}
                    studentName={studentName}
                    onClose={enrollModal.close}
                />
            )}

            {/* Withdraw Modal */}
            {isAdmin && withdrawModal.opened && withdrawModal.item && (
                <WithdrawCourseModal
                    opened={withdrawModal.opened}
                    studentId={studentId}
                    studentName={studentName}
                    courseId={withdrawModal.item.courseId}
                    courseCode={withdrawModal.item.code}
                    courseName={withdrawModal.item.name}
                    onClose={withdrawModal.close}
                />
            )}
        </>
    );
}
