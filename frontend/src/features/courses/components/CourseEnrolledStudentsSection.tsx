import { Paper, Title, Stack, Table, Text, Badge, Group, Loader, Center, ActionIcon, Tooltip } from '@mantine/core';
import { GraduationCap, Edit } from 'lucide-react';
import { useCourseEnrolledStudents } from '@/features/courses/get-enrolled-students/useCourseEnrolledStudents';
import { useModalState } from '@/features/_common/hooks/useModalState';
import { AssignGradeModal } from '@/features/students/components/AssignGradeModal';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import type { EnrolledStudentResponse } from '@/features/courses/get-enrolled-students/types';
import { useAuth } from '@/features/auth/_contexts/AuthContext';

interface CourseEnrolledStudentsSectionProps {
    courseId: number;
    courseName: string;
    professorId?: number;
}

export function CourseEnrolledStudentsSection({
    courseId,
    courseName,
    professorId,
}: CourseEnrolledStudentsSectionProps) {
    const { user, isAdmin } = useAuth();
    const canAssignGrade = isAdmin || (user?.professorCode && professorId); // Professors can only assign grades to their own courses

    const { data, isLoading, isError, error } = useCourseEnrolledStudents(courseId);
    const gradeModal = useModalState<EnrolledStudentResponse>();

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleGradeClick = (student: EnrolledStudentResponse) => {
        gradeModal.open(student);
    };

    const formatGrade = (grade?: number) => {
        if (grade === undefined || grade === null) {
            return (
                <Text size="sm" c="dimmed" fs="italic">
                    Neasignată
                </Text>
            );
        }
        return (
            <Badge variant="light" color={grade >= 5 ? 'green' : 'red'}>
                {grade.toFixed(2)}
            </Badge>
        );
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
                    errors={error?.message || 'Nu s-a putut încărca studenții înscriși'}
                    onClose={() => { }}
                />
            </Paper>
        );
    }

    const enrolledStudents = data?.enrolledStudents || [];
    const totalStudents = data?.totalEnrolledStudents || 0;

    return (
        <>
            <Paper p="md" shadow="sm" withBorder>
                <Stack gap="lg">
                    {/* Header */}
                    <Group justify="space-between">
                        <Group>
                            <GraduationCap size={24} strokeWidth={1.5} />
                            <div>
                                <Title order={4}>Studenți Înscriși</Title>
                                <Text size="sm" c="dimmed">
                                    Total: <strong>{totalStudents}</strong> {totalStudents === 1 ? 'student' : 'studenți'}
                                </Text>
                            </div>
                        </Group>
                    </Group>

                    {/* Students Table */}
                    {enrolledStudents.length === 0 ? (
                        <Text size="sm" c="dimmed" fs="italic" ta="center" py="xl">
                            Niciun student înscris la acest curs.
                        </Text>
                    ) : (
                        <Table striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Cod Student</Table.Th>
                                    <Table.Th>Nume</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>Data Înscrierii</Table.Th>
                                    <Table.Th>Notă</Table.Th>
                                    {canAssignGrade && <Table.Th style={{ width: '80px' }}>Acțiuni</Table.Th>}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {enrolledStudents.map((student) => (
                                    <Table.Tr key={student.studentId}>
                                        <Table.Td>
                                            <Badge variant="light" color="blue">
                                                {student.studentCode}
                                            </Badge>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" fw={500}>
                                                {student.fullName}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {student.email}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Text size="sm" c="dimmed">
                                                {formatDate(student.enrollmentDate)}
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <Group gap="xs">
                                                {formatGrade(student.grade)}
                                                {student.assignedByProfessor && (
                                                    <Tooltip label={`Asignată de: ${student.assignedByProfessor}`}>
                                                        <Text size="xs" c="dimmed">
                                                            ({student.assignedByProfessor.split(' ').map(n => n[0]).join('.')})
                                                        </Text>
                                                    </Tooltip>
                                                )}
                                            </Group>
                                        </Table.Td>
                                        {canAssignGrade && (
                                            <Table.Td>
                                                <Tooltip label={student.grade ? "Modifică nota" : "Asignează notă"}>
                                                    <ActionIcon
                                                        variant="subtle"
                                                        color="blue"
                                                        onClick={() => handleGradeClick(student)}
                                                        aria-label="Asignează/Modifică notă"
                                                    >
                                                        <Edit size={18} />
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

            {/* Grade Assignment Modal */}
            {canAssignGrade && gradeModal.opened && gradeModal.item && (
                <AssignGradeModal
                    opened={gradeModal.opened}
                    onClose={gradeModal.close}
                    courseId={courseId}
                    studentId={gradeModal.item.studentId}
                    courseName={courseName}
                    currentGrade={gradeModal.item.grade}
                />
            )}
        </>
    );
}
