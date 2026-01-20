import { api } from "@/lib/api";
import type { CreateProfessorRequest } from "./types";
import type { ProfessorResponse } from "@/features/professors/_common/types";

export const createProfessor = async (
  data: CreateProfessorRequest,
): Promise<ProfessorResponse> => {
  const response = await api.post<ProfessorResponse>("/professors", data);
  return response.data;
};
