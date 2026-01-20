import { api } from "@/lib/api";
import type { UpdateProfessorRequest } from "./types";

export const updateProfessor = async (
  id: number,
  data: UpdateProfessorRequest,
): Promise<void> => {
  await api.put(`/professors/${id}`, data);
};
