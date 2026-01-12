import { api } from '@/lib/api';
import type { AcademicSituationResponse } from '@/features/students/get-enrolled-courses/types';

/**
 * Fetches enrolled courses for a student.
 * @param studentIdentifier - Either a numeric student ID or a student code string
 */
export const getStudentEnrolledCourses = async (
    studentIdentifier: number | string
): Promise<AcademicSituationResponse> => {
    const response = await api.get<AcademicSituationResponse>(
        `/students/${studentIdentifier}/courses`
    );
    return response.data;
};
