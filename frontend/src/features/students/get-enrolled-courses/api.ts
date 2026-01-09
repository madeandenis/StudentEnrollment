import { api } from '@/lib/api';
import type { AcademicSituationResponse } from '@/features/students/get-enrolled-courses/types';

export const getStudentEnrolledCourses = async (studentId: number): Promise<AcademicSituationResponse> => {
    const response = await api.get<AcademicSituationResponse>(`/students/${studentId}/courses`);
    return response.data;
};
