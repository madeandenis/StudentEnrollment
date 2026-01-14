import type { PaginatedList } from "@/features/_common/types/dto.types";
import type { CourseResponse } from "@/features/courses/_common/types";

export type CourseResponsePaginatedList = PaginatedList<CourseResponse>;

export interface CourseListParams {
  PageIndex: number;
  PageSize: number;
  SortBy?: string;
  SortOrder?: string;
  Search?: string;
  Code?: string;
  Name?: string;
  MinCredits?: number;
  MaxCredits?: number;
  HasAvailableSeats?: boolean;
}
