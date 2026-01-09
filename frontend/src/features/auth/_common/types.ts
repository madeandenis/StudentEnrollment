export interface ClaimsUser {
    userId: string;
    userName: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phoneNumber: string | null;
    roles: string[];
    studentCode: string | null;
}
