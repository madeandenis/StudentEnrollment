import { api } from "@/lib/api";
import type { ProfessorAssignedCoursesResponse } from "./types";

export const getProfessorAssignedCourses = async (
    professorIdentifier: string | number
): Promise<ProfessorAssignedCoursesResponse> => {
    const response = await api.get<ProfessorAssignedCoursesResponse>(
        `/professors/${professorIdentifier}/courses`
    );

    return response.data;
};
