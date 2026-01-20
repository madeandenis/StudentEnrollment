export interface UserResponse {
  id: number;
  userName?: string;
  email?: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  roles: string[];
}
