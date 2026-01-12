import { Modal, Button, Group, Select, Stack, Text } from '@mantine/core';
import { useState, useMemo } from 'react';
import { notifications } from '@mantine/notifications';
import { useCourseList } from '@/features/courses/get-list/useCourseList';
import { useEnrollStudent } from '@/features/courses/enroll/useEnrollStudent';
import { useStudentEnrolledCourses } from '@/features/students/get-enrolled-courses/useStudentEnrolledCourses';
import type { CourseResponse } from '@/features/courses/_common/types';
import ErrorAlert from '@/features/_common/components/ErrorAlert';
import { useErrorHandler } from '@/features/_common/hooks/useErrorHandler';

interface EnrollStudentModalProps {
    opened: boolean;
    studentId: number;
    studentName: string;
    onClose: () => void;
}

export function EnrollStudentModal({ opened, studentId, studentName, onClose }: EnrollStudentModalProps) {
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

    const { errors, handleError, clearErrors } = useErrorHandler({});

    // Fetch available courses with available seats
    const { data: coursesData, isLoading: isLoadingCourses } = useCourseList({
        PageIndex: 1,
        PageSize: 100,
        HasAvailableSeats: true,
    });

    // Fetch student's enrolled courses
    const { data: enrolledCoursesData } = useStudentEnrolledCourses(studentId);

    // Enroll mutation
    const enrollMutation = useEnrollStudent();

    // Filter out courses the student is already enrolled in
    const availableCourses = useMemo(() => {
        if (!coursesData?.items || !enrolledCoursesData?.enrolledCourses) {
            return coursesData?.items || [];
        }

        const enrolledCourseCodes = new Set(
            enrolledCoursesData.enrolledCourses.map((course) => course.code)
        );

        return coursesData.items.filter(
            (course: CourseResponse) => !enrolledCourseCodes.has(course.courseCode)
        );
    }, [coursesData, enrolledCoursesData]);

    // Convert courses to select options
    const courseOptions = useMemo(() => {
        return availableCourses.map((course: CourseResponse) => ({
            value: course.id.toString(),
            label: `${course.courseCode} - ${course.name} (${course.availableSeats} locuri disponibile)`,
        }));
    }, [availableCourses]);

    const handleEnroll = async () => {
        if (!selectedCourseId) return;

        clearErrors();

        try {
            await enrollMutation.mutateAsync({
                courseId: parseInt(selectedCourseId),
                studentId,
            });

            notifications.show({
                title: 'Succes',
                message: `${studentName} a fost înscris la curs cu succes!`,
                color: 'green',
            });

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

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title="Înscriere Student la Curs"
            size="md"
        >
            <Stack gap="md">
                {errors && <ErrorAlert errors={errors} onClose={clearErrors} />}

                <Text size="sm" c="dimmed">
                    Student: <strong>{studentName}</strong>
                </Text>

                <Select
                    label="Selectează Cursul"
                    placeholder="Alege un curs"
                    data={courseOptions}
                    value={selectedCourseId}
                    onChange={setSelectedCourseId}
                    searchable
                    nothingFoundMessage="Nu există cursuri disponibile"
                    disabled={isLoadingCourses || enrollMutation.isPending}
                    required
                />

                {availableCourses.length === 0 && !isLoadingCourses && (
                    <Text size="sm" c="dimmed" fs="italic">
                        Nu există cursuri disponibile pentru înscriere. Studentul este deja înscris
                        la toate cursurile sau nu există cursuri cu locuri disponibile.
                    </Text>
                )}

                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" onClick={handleClose} disabled={enrollMutation.isPending}>
                        Anulează
                    </Button>
                    <Button
                        onClick={handleEnroll}
                        loading={enrollMutation.isPending}
                        disabled={!selectedCourseId || isLoadingCourses}
                    >
                        Înscrie Student
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
