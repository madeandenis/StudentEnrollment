import type { Address } from "@/features/_common/types/dto.types";

export interface CreateStudentRequest {
  cnp: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  address: Address;
}
