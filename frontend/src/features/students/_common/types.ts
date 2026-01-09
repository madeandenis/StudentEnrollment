import type { Address } from "@/features/_common/types";

export interface StudentResponse {
    id: number;
    studentCode: string;
    cnp: string;
    fullName: string;
    dateOfBirth: string;
    email: string;
    phoneNumber: string;
    address: Address | null;
    createdAt: string;
}

