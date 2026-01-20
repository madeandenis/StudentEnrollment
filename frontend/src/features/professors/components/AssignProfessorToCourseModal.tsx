import { Modal, Button, Group, Select, Stack, Text } from '@mantine/core';
import { useState, useMemo } from 'react';
import { notifications } from '@mantine/notifications';
import { useCourseList } from '@/features/courses/get-list/useCourseList';
import { useAssignProfessor } from '@/features/courses/assign-professor/useAssignProfessor';
import { useProfessorAssignedCourses } from '@/features/professors/get-assigned-courses/useProfessorAssignedCourses';
import type { CourseResponse } from '@/features/courses/_common/types';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import { useErrorHandler } from '@/features/_common/hooks/useErrorHandler';
import { useQueryClient } from '@tanstack/react-query';

interface AssignProfessorToCourseModalProps {
    opened: boolean;
    professorId: number;
    professorName: string;
    professorCode: string;
    onClose: () => void;
}

export function AssignProfessorToCourseModal({
    opened,
    professorId,
    professorName,
    professorCode,
    onClose
}: AssignProfessorToCourseModalProps) {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    const { errors, handleError, clearErrors } = useErrorHandler({});

    // Fetch available courses without assigned professor
    const { data: coursesData, isLoading: isLoadingCourses } = useCourseList({
        PageIndex: 1,
        PageSize: 100,
        HasAssignedProfessor: false,
    });

    // Fetch professor's assigned courses
    const { data: assignedCoursesData } = useProfessorAssignedCourses(professorId);

    // Assign mutation
    const assignMutation = useAssignProfessor();

    // Filter out courses the professor is already assigned to
    const availableCourses = useMemo(() => {
        if (!coursesData?.items || !assignedCoursesData?.assignedCourses) {
            return coursesData?.items || [];
        }

        const assignedCourseIds = new Set(
            assignedCoursesData.assignedCourses.map((course) => course.courseId)
        );

        return coursesData.items.filter(
            (course: CourseResponse) => !assignedCourseIds.has(course.id)
        );
    }, [coursesData, assignedCoursesData]);

    // Convert courses to select options
    const courseOptions = useMemo(() => {
        return availableCourses.map((course: CourseResponse) => ({
            value: course.id.toString(),
            label: `${course.courseCode} - ${course.name} (${course.credits} credite)`,
        }));
    }, [availableCourses]);

    const handleAssign = async () => {
        if (!selectedCourseId) return;

        clearErrors();

        try {
            await assignMutation.mutateAsync({
                courseId: parseInt(selectedCourseId),
                professorIdentifier: professorCode,
            });

            notifications.show({
                title: 'Succes',
                message: `Profesorul ${professorName} a fost asignat cursului cu succes!`,
                color: 'green',
            });

            // Invalidate queries to refresh data
            queryClient.invalidateQueries({ queryKey: ['professor-assigned-courses', professorId] });
            queryClient.invalidateQueries({ queryKey: ['courses'] });

            setSelectedCourseId(null);
            onClose();
        } catch (error: any) {
            handleError(error);
        }
    };

    const handleClose = () => {
        setSelectedCourseId(null);
        clearErrors();
        onClose();
    };

    const noCoursesExist = coursesData?.items?.length === 0;
    const professorAlreadyAssignedAll = availableCourses.length === 0 && !noCoursesExist;

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Asignare Profesor la Curs"
            size="md"
        >
            <Stack gap="md">
                {errors && <ErrorAlert errors={errors} onClose={clearErrors} />}

                <Text size="sm" c="dimmed">
                    Profesor: <strong>{professorName}</strong>
                </Text>

                <Select
                    label="Selectează Cursul"
                    placeholder="Alege un curs"
                    data={courseOptions}
                    value={selectedCourseId}
                    onChange={setSelectedCourseId}
                    searchable
                    nothingFoundMessage="Nu există cursuri disponibile"
                    disabled={isLoadingCourses || assignMutation.isPending}
                    required
                />

                {!isLoadingCourses && (
                    <>
                        {noCoursesExist && (
                            <Text size="sm" c="dimmed" fs="italic">
                                Nu există cursuri înregistrate în sistem.
                            </Text>
                        )}
                        {professorAlreadyAssignedAll && (
                            <Text size="sm" c="dimmed" fs="italic">
                                Profesorul este deja asignat la toate cursurile disponibile.
                            </Text>
                        )}
                    </>
                )}

                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" onClick={handleClose} disabled={assignMutation.isPending}>
                        Anulează
                    </Button>
                    <Button
                        onClick={handleAssign}
                        loading={assignMutation.isPending}
                        disabled={
                            !selectedCourseId ||
                            isLoadingCourses
                        }
                    >
                        Asignează Profesor
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
