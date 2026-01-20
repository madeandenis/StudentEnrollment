import { api } from "@/lib/api";
import type { UserResponsePaginatedList, UserListParams } from "./types";

export const getUserList = async (
  params: UserListParams,
): Promise<UserResponsePaginatedList> => {
  const response = await api.get<UserResponsePaginatedList>("/users", {
    params,
  });
  return response.data;
};
