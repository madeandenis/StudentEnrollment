import type { Address } from "@/features/_common/types/dto.types";

export interface ProfessorResponse {
  id: number;
  professorCode: string;
  userId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  address?: Address;
  createdAt: string;
}
