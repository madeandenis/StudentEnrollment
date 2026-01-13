import { api } from "@/lib/api";
import type { MeResponse } from '@/features/auth/me/types';

export const getMe = async (): Promise<MeResponse> => {
    const response = await api.get<MeResponse>('/auth/me');
    return response.data;
};
