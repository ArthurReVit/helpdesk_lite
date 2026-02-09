export type Tag = {
  id: number;
  name: string;
  created_at: string | null;
};

export type TagSortDirection = "asc" | "desc";
export type TagSortBy = "name" | "created_at" | "id";

export type ListTagsQuery = {
  sort?: TagSortDirection;
  sort_by?: TagSortBy;
  limit?: number;
};

export type ListTagsResponse = {
  tags: Tag[];
};

export type CreateTagRequest = {
  name: string;
};

export type CreateTagResponse = {
  message: string;
  id: number;
};

export type RenameTagRequest = {
  tag_id: number;
  name: string;
};

export type RenameTagResponse = {
  message: string;
};

export type DeleteTagRequest = {
  tag_id: number;
};

export type DeleteTagResponse = {
  message: string;
};
