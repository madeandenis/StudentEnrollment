import { Modal, Stack, Text, Button, NumberInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useAssignGrade } from '@/features/courses/assign-grade/useAssignGrade';
import { notifications } from '@mantine/notifications';
import { useQueryClient } from '@tanstack/react-query';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import { useErrorHandler } from '@/features/_common/hooks/useErrorHandler';

interface AssignGradeModalProps {
    opened: boolean;
    onClose: () => void;
    courseId: number;
    studentId: number;
    courseName: string;
    currentGrade?: number;
}

export function AssignGradeModal({
    opened,
    onClose,
    courseId,
    studentId,
    courseName,
    currentGrade,
}: AssignGradeModalProps) {
    const queryClient = useQueryClient();
    const assignGradeMutation = useAssignGrade();

    const {
        errors,
        handleError,
        clearErrors,
    } = useErrorHandler({});

    const form = useForm({
        initialValues: {
            grade: currentGrade ?? 0,
        },
        validate: {
            grade: (value) => {
                if (value < 1 || value > 10) {
                    return 'Nota trebuie să fie între 1 și 10';
                }
                return null;
            },
        },
    });

    const handleSubmit = async (values: { grade: number }) => {
        try {
            await assignGradeMutation.mutateAsync({
                courseId,
                studentId,
                grade: values.grade,
            });

            notifications.show({
                title: 'Succes',
                message: `Nota ${values.grade} a fost atribuită cu succes pentru cursul "${courseName}"`,
                color: 'green',
            });

            // Invalidate queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['students', studentId, 'enrolled-courses'] });
            queryClient.invalidateQueries({ queryKey: ['courses', courseId, 'enrolled-students'] });
            queryClient.invalidateQueries({ queryKey: ['courses', courseId, 'details'] });

            clearErrors();
            form.reset();
            onClose();
        } catch (error: any) {
            handleError(error);
        }
    };

    const handleClose = () => {
        clearErrors();
        form.reset();
        onClose();
    };

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={currentGrade ? "Modifică Nota" : "Adaugă Notă"}
            size="md"
        >
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <Text size="sm" c="dimmed">
                        {currentGrade
                            ? `Modifică nota pentru cursul "${courseName}". Nota curentă: ${currentGrade}`
                            : `Adaugă o notă pentru cursul "${courseName}"`
                        }
                    </Text>

                    <NumberInput
                        label="Notă"
                        placeholder="Introduceți nota (1-10)"
                        min={1}
                        max={10}
                        step={0.01}
                        decimalScale={2}
                        required
                        {...form.getInputProps('grade')}
                    />

                    {errors && (
                        <ErrorAlert errors={errors} onClose={clearErrors} />
                    )}

                    <Button
                        type="submit"
                        fullWidth
                        loading={assignGradeMutation.isPending}
                    >
                        {currentGrade ? 'Actualizează Nota' : 'Adaugă Nota'}
                    </Button>
                </Stack>
            </form>
        </Modal>
    );
}
