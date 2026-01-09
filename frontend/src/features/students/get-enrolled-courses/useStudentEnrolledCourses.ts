import { useQuery } from '@tanstack/react-query';
import { getStudentEnrolledCourses } from '@/features/students/get-enrolled-courses/api';

export const useStudentEnrolledCourses = (studentId: number) => {
    return useQuery({
        queryKey: ['students', 'enrolled-courses', studentId],
        queryFn: () => getStudentEnrolledCourses(studentId),
        enabled: !!studentId,
    });
};
