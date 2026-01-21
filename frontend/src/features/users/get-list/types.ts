import type { PaginatedList } from "@/features/_common/types/dto.types";
import type { UserResponse } from "@/features/users/_common/types";

export type UserResponsePaginatedList = PaginatedList<UserResponse>;

export interface UserListParams {
  PageIndex: number;
  PageSize: number;
  SortBy?: string;
  SortOrder?: "asc" | "desc";
  Search?: string;
  IsAdmin?: boolean;
  ExcludeWithProfessor?: boolean;
}
