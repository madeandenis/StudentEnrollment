import { useQuery } from '@tanstack/react-query';
import { getStudentEnrolledCourses } from '@/features/students/get-enrolled-courses/api';

/**
 * React Query hook to fetch enrolled courses for a student.
 * @param studentIdentifier - Either a numeric student ID, a student code string, or undefined
 */
export const useStudentEnrolledCourses = (studentIdentifier?: number | string | null) => {
    return useQuery({
        queryKey: ['students', 'enrolled-courses', studentIdentifier],
        queryFn: () => getStudentEnrolledCourses(studentIdentifier!),
        enabled: !!studentIdentifier,
    });
};
