import { api } from "@/lib/api";
import type { AssignProfessorRequest } from "./types";

export const assignProfessor = async ({
  courseId,
  professorIdentifier,
}: AssignProfessorRequest): Promise<void> => {
  await api.post(`/courses/${courseId}/assign/${professorIdentifier}`);
};
