import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setAuthToken, getAuthToken } from "./authCookies";
import type {
  AuthUserModel,
  LoginRequestModel,
  LoginResponseModel,
} from "../../models/auth";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/auth`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponseModel, LoginRequestModel>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        const { data } = await queryFulfilled;

        setAuthToken(data.access_token);
        dispatch(
          authApi.endpoints.me.initiate(undefined, { forceRefetch: true }),
        );
      },
    }),
    me: builder.query<AuthUserModel, void>({
      query: () => "/me",
    }),
  }),
});

export const { useLoginMutation, useMeQuery } = authApi;
