import { api } from "@/lib/api";
import type { ProfessorResponse } from "@/features/professors/_common/types";

export const getProfessorDetails = async (
  id: number,
): Promise<ProfessorResponse> => {
  const response = await api.get<ProfessorResponse>(`/professors/${id}`);
  return response.data;
};
