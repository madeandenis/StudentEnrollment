import { useQuery } from '@tanstack/react-query';
import { getCourseEnrolledStudents } from './api';

export const useCourseEnrolledStudents = (courseId: number) => {
    return useQuery({
        queryKey: ['courses', courseId, 'enrolled-students'],
        queryFn: () => getCourseEnrolledStudents(courseId),
        enabled: !!courseId,
    });
};
