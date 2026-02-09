import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAuthToken } from "./authCookies";
import type {
  CreateTagRequest,
  CreateTagResponse,
  DeleteTagRequest,
  DeleteTagResponse,
  ListTagsQuery,
  ListTagsResponse,
  RenameTagRequest,
  RenameTagResponse,
} from "../../models/tag";

export const tagApi = createApi({
  reducerPath: "tagApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/tags`,
    prepareHeaders: (headers) => {
      const token = getAuthToken();
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    listTags: builder.query<ListTagsResponse, ListTagsQuery | undefined>({
      query: (params) => ({
        url: "/",
        method: "GET",
        params,
      }),
    }),
    createTag: builder.mutation<CreateTagResponse, CreateTagRequest>({
      query: (body) => ({
        url: "/",
        method: "POST",
        body,
      }),
    }),
    renameTag: builder.mutation<RenameTagResponse, RenameTagRequest>({
      query: ({ tag_id, name }) => ({
        url: `/${tag_id}`,
        method: "PATCH",
        body: { name },
      }),
    }),
    deleteTag: builder.mutation<DeleteTagResponse, DeleteTagRequest>({
      query: ({ tag_id }) => ({
        url: `/${tag_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useListTagsQuery,
  useCreateTagMutation,
  useRenameTagMutation,
  useDeleteTagMutation,
} = tagApi;
