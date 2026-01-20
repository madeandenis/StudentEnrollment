import type { PaginatedList } from "@/features/_common/types/dto.types";
import type { ProfessorResponse } from "@/features/professors/_common/types";

export type ProfessorResponsePaginatedList = PaginatedList<ProfessorResponse>;

export interface ProfessorListParams {
  PageIndex: number;
  PageSize: number;
  SortBy?: string;
  SortOrder?: "asc" | "desc";
  Search?: string;
  Email?: string;
  RegisteredFrom?: string;
  RegisteredTo?: string;
}
