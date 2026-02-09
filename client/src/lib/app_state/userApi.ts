import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "./authCookies";
import type {
  ChangePasswordRequest,
  ChangePasswordResponse,
  DeleteUserRequest,
  ListUsersQuery,
  ListUsersResponse,
  RegisterUserRequest,
  RegisterUserResponse,
  SetUserActiveRequest,
} from "../../models/user";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/users`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation<RegisterUserResponse, RegisterUserRequest>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    listUsers: builder.query<ListUsersResponse, ListUsersQuery | undefined>({
      query: (params) => ({
        url: "/all",
        method: "GET",
        params,
      }),
    }),
    deleteUser: builder.mutation<void, DeleteUserRequest>({
      query: ({ user_id }) => ({
        url: `/${user_id}`,
        method: "DELETE",
      }),
    }),
    setUserActive: builder.mutation<void, SetUserActiveRequest>({
      query: ({ user_id, is_active }) => ({
        url: `/${user_id}/active`,
        method: "PATCH",
        body: { is_active },
      }),
    }),
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: "/me/password",
        method: "PATCH",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useListUsersQuery,
  useDeleteUserMutation,
  useSetUserActiveMutation,
  useChangePasswordMutation,
} = userApi;
