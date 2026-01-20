import { api } from "@/lib/api";
import type { UnassignProfessorRequest } from "@/features/courses/_common/types";

export const unassignProfessor = async ({
  courseId,
  professorIdentifier,
}: UnassignProfessorRequest): Promise<void> => {
  await api.delete(`/courses/${courseId}/unassign/${professorIdentifier}`);
};
