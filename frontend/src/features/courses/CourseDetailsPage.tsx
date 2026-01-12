import { useParams, useNavigate } from '@tanstack/react-router';
import {
    Paper,
    Title,
    Group,
    Button,
    Stack,
    Loader,
    Center,
    Grid,
    Text,
    Badge,
    Divider,
    ActionIcon,
    Tooltip,
} from '@mantine/core';
import { ArrowLeft, Edit, Trash2, BookOpen, Award, Users, Calendar } from 'lucide-react';
import { useCourseDetails } from '@/features/courses/get-details/useCourseDetails';
import { useDeleteCourse } from '@/features/courses/delete/useDeleteCourse';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import { useErrorHandler } from '@/features/_common/hooks/useErrorHandler';
import { useModalState } from '@/features/_common/hooks/useModalState';
import { ConfirmModal } from '../_common/components/ConfirmModal';
import { CourseFormModal } from '@/features/courses/components/CourseFormModal';

export function CourseDetailsPage() {
    const { id } = useParams({ from: '/protected/courses/$id' });
    const navigate = useNavigate();
    const courseId = parseInt(id);

    const formModal = useModalState();
    const deleteModal = useModalState<{ id: number; name: string }>();

    // Fetch course details
    const { data: course, isLoading, isError, error } = useCourseDetails(courseId);

    // Error handling for deletion
    const {
        errors: deleteErrors,
        handleError: handleDeleteError,
        clearErrors: clearDeleteErrors,
    } = useErrorHandler({});

    // Handlers
    const handleBack = () => {
        navigate({ to: '/courses' });
    };

    const handleEdit = () => {
        formModal.open();
    };

    const handleDeleteClick = () => {
        if (course) {
            deleteModal.open({ id: course.id, name: course.name });
        }
    };

    const deleteCourseMutation = useDeleteCourse();
    const handleDeleteConfirm = async () => {
        if (!deleteModal.item) return;
        try {
            await deleteCourseMutation.mutateAsync(deleteModal.item.id);
            deleteModal.close();
            clearDeleteErrors();
            navigate({ to: '/courses' });
        } catch (error: any) {
            handleDeleteError(error);
        }
    };

    // Format date helper
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ro-RO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    // Loading state
    if (isLoading) {
        return (
            <Center py="xl">
                <Loader size="lg" />
            </Center>
        );
    }

    // Error state
    if (isError || !course) {
        return (
            <Paper p="md" shadow="sm" withBorder>
                <ErrorAlert
                    errors={error?.message || 'Nu s-a putut încărca datele cursului'}
                    onClose={() => { }}
                />
                <Button mt="md" onClick={handleBack} leftSection={<ArrowLeft size={18} />}>
                    Înapoi la listă
                </Button>
            </Paper>
        );
    }

    return (
        <>
            <Paper p="md" shadow="sm" withBorder>
                <Stack gap="lg">
                    {/* Header */}
                    <Group justify="space-between">
                        <Group>
                            <ActionIcon
                                variant="subtle"
                                size="lg"
                                onClick={handleBack}
                                aria-label="Înapoi"
                            >
                                <ArrowLeft size={20} />
                            </ActionIcon>
                            <div>
                                <Title order={2}>{course.name}</Title>
                                <Group gap="xs" mt={4}>
                                    <Badge variant="light" color="blue">
                                        {course.courseCode}
                                    </Badge>
                                    <Text size="sm" c="dimmed">
                                        Curs
                                    </Text>
                                </Group>
                            </div>
                        </Group>

                        <Group>
                            <Tooltip label="Editează">
                                <ActionIcon
                                    variant="light"
                                    color="blue"
                                    size="lg"
                                    onClick={handleEdit}
                                    aria-label="Editează curs"
                                >
                                    <Edit size={18} />
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Șterge">
                                <ActionIcon
                                    variant="light"
                                    color="red"
                                    size="lg"
                                    onClick={handleDeleteClick}
                                    aria-label="Șterge curs"
                                >
                                    <Trash2 size={18} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>
                    </Group>

                    <Divider />

                    {/* Course Information */}
                    <div>
                        <Title order={4} mb="md">
                            Informații Curs
                        </Title>
                        <Grid>
                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <Group gap="xs" mb="sm">
                                    <Award size={18} strokeWidth={1.5} style={{ color: 'var(--mantine-color-dimmed)' }} />
                                    <div>
                                        <Text size="xs" c="dimmed">
                                            Credite
                                        </Text>
                                        <Text size="sm" fw={500}>
                                            {course.credits} {course.credits === 1 ? 'credit' : 'credite'}
                                        </Text>
                                    </div>
                                </Group>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <Group gap="xs" mb="sm">
                                    <Users size={18} strokeWidth={1.5} style={{ color: 'var(--mantine-color-dimmed)' }} />
                                    <div>
                                        <Text size="xs" c="dimmed">
                                            Capacitate Maximă
                                        </Text>
                                        <Text size="sm" fw={500}>
                                            {course.maxEnrollment} {course.maxEnrollment === 1 ? 'student' : 'studenți'}
                                        </Text>
                                    </div>
                                </Group>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <Group gap="xs" mb="sm">
                                    <BookOpen size={18} strokeWidth={1.5} style={{ color: 'var(--mantine-color-dimmed)' }} />
                                    <div>
                                        <Text size="xs" c="dimmed">
                                            Studenți Înscriși
                                        </Text>
                                        <Text size="sm" fw={500}>
                                            {course.enrolledStudents} / {course.maxEnrollment}
                                        </Text>
                                    </div>
                                </Group>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, sm: 6 }}>
                                <Group gap="xs" mb="sm">
                                    <Users size={18} strokeWidth={1.5} style={{ color: 'var(--mantine-color-dimmed)' }} />
                                    <div>
                                        <Text size="xs" c="dimmed">
                                            Locuri Disponibile
                                        </Text>
                                        <Group gap="xs">
                                            <Text size="sm" fw={500}>
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
                                    </div>
                                </Group>
                            </Grid.Col>
                        </Grid>
                    </div>

                    <Divider />

                    {/* Description */}
                    <div>
                        <Title order={4} mb="md">
                            Descriere
                        </Title>
                        {course.description ? (
                            <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                                {course.description}
                            </Text>
                        ) : (
                            <Text size="sm" c="dimmed" fs="italic">
                                Descriere nedefinită
                            </Text>
                        )}
                    </div>

                    <Divider />

                    {/* Metadata */}
                    <div>
                        <Group gap="xs">
                            <Calendar size={16} strokeWidth={1.5} style={{ color: 'var(--mantine-color-dimmed)' }} />
                            <Text size="xs" c="dimmed">
                                Creat la: {formatDate(course.createdAt)}
                            </Text>
                        </Group>
                    </div>
                </Stack>
            </Paper>

            {/* Edit Modal */}
            <CourseFormModal
                opened={formModal.opened}
                courseId={courseId}
                onClose={formModal.close}
            />

            {/* Delete Confirmation Modal */}
            {deleteModal.opened && deleteModal.item && (
                <ConfirmModal
                    opened={deleteModal.opened}
                    item={deleteModal.item.name}
                    confirmLabel="Șterge Curs"
                    title="Confirmare ștergere"
                    description={(name) =>
                        `Ești sigur că vrei să ștergi cursul ${name}? Această acțiune nu poate fi anulată.`
                    }
                    isLoading={deleteCourseMutation.isPending}
                    onClose={deleteModal.close}
                    onConfirm={handleDeleteConfirm}
                />
            )}

            {/* Delete Error Alert */}
            {deleteErrors && deleteModal.opened && (
                <ErrorAlert
                    errors={deleteErrors}
                    onClose={clearDeleteErrors}
                    style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, maxWidth: 400 }}
                />
            )}
        </>
    );
}
