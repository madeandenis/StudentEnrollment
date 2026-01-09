import { useQuery } from '@tanstack/react-query';
import { getCourseDetails } from '@/features/courses/get-details/api';

export const useCourseDetails = (courseId: number) => {
    return useQuery({
        queryKey: ['courses', 'details', courseId],
        queryFn: () => getCourseDetails(courseId),
        enabled: !!courseId,
    });
};  
