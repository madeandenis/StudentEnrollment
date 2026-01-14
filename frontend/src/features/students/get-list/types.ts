import type { PaginatedList } from "@/features/_common/types/dto.types";
import type { StudentResponse } from "@/features/students/_common/types";

export type StudentResponsePaginatedList = PaginatedList<StudentResponse>;

export interface StudentListParams {
  PageIndex: number;
  PageSize: number;
  SortBy?: string;
  SortOrder?: string;
  Search?: string;
  Email?: string;
  RegisteredFrom?: string;
  RegisteredTo?: string;
}
