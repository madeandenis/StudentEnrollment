import { Modal, Button, Group, Stack, Text } from '@mantine/core';
import { AlertTriangle } from 'lucide-react';
import { notifications } from '@mantine/notifications';
import { useUnassignProfessor } from '@/features/courses/unassign-professor/useUnassignProfessor';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import { useErrorHandler } from '@/features/_common/hooks/useErrorHandler';
import { useQueryClient } from '@tanstack/react-query';

interface UnassignProfessorFromCourseModalProps {
    opened: boolean;
    professorId: number;
    professorName: string;
    professorCode: string;
    courseId: number;
    courseCode: string;
    courseName: string;
    onClose: () => void;
}

export function UnassignProfessorFromCourseModal({
    opened,
    professorId,
    professorName,
    professorCode,
    courseId,
    courseCode,
    courseName,
    onClose,
}: UnassignProfessorFromCourseModalProps) {
    const queryClient = useQueryClient();
    const { errors, handleError, clearErrors } = useErrorHandler({});

    // Unassign mutation
    const unassignMutation = useUnassignProfessor();

    const handleUnassign = async () => {
        clearErrors();

        try {
            await unassignMutation.mutateAsync({
                courseId,
                professorIdentifier: professorCode,
            });

            notifications.show({
                title: 'Succes',
                message: `Profesorul ${professorName} a fost dezasignat de la cursul ${courseCode} cu succes!`,
                color: 'green',
            });

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['professor-assigned-courses', professorId] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });

            onClose();
        } catch (error: any) {
            handleError(error);
        }
    };

    const handleClose = () => {
        clearErrors();
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Confirmare Dezasignare"
            size="md"
        >
            <Stack gap="md">
                {errors && <ErrorAlert errors={errors} onClose={clearErrors} />}

                <Group gap="sm">
                    <AlertTriangle size={20} color="var(--mantine-color-orange-6)" />
                    <Text size="sm">
                        Ești sigur că vrei să dezasignezi profesorul{' '}
                        <strong>{professorName}</strong> de la cursul{' '}
                        <strong>{courseCode} - {courseName}</strong>?
                    </Text>
                </Group>

                <Group justify="flex-end" mt="md">
                    <Button
                        variant="subtle"
                        onClick={handleClose}
                        disabled={unassignMutation.isPending}
                    >
                        Anulează
                    </Button>
                    <Button
                        color="red"
                        onClick={handleUnassign}
                        loading={unassignMutation.isPending}
                    >
                        Dezasignează
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
