import type { Address } from "@/features/_common/types/dto.types";

export interface CreateProfessorRequest {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: Address;
}
