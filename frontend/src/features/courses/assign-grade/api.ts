import { api } from "@/lib/api";
import type { AssignGradeRequest } from "./types";

export const assignGrade = async ({
  courseId,
  studentId,
  grade,
}: AssignGradeRequest): Promise<void> => {
  await api.post(`/courses/${courseId}/assign/${studentId}/grade`, { grade });
};
