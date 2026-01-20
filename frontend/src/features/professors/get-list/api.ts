import { api } from "@/lib/api";
import type {
  ProfessorResponsePaginatedList,
  ProfessorListParams,
} from "./types";

export const getProfessorList = async (
  params: ProfessorListParams,
): Promise<ProfessorResponsePaginatedList> => {
  const response = await api.get<ProfessorResponsePaginatedList>(
    "/professors",
    { params },
  );
  return response.data;
};
