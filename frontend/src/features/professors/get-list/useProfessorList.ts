import { useQuery } from "@tanstack/react-query";
import { getProfessorList } from "./api";
import type { ProfessorListParams } from "./types";

export const useProfessorList = (params: ProfessorListParams) => {
  return useQuery({
    queryKey: ["professors", params],
    queryFn: () => getProfessorList(params),
  });
};
