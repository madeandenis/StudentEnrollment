import type { Address } from "@/features/_common/types";

export interface UpdateStudentRequest {
    cnp: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    address: Address;
}
