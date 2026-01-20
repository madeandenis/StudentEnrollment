import { api } from "@/lib/api";
import type { ProfessorAssignedCoursesResponse } from "./types";

export const getProfessorAssignedCourses = async (
    professorId: number
): Promise<ProfessorAssignedCoursesResponse> => {
    const response = await api.get<ProfessorAssignedCoursesResponse>(
        `/professors/${professorId}/courses`
    );

    return response.data;
};
