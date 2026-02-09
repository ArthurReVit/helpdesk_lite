export type UserRole = "admin" | "agent" | "requester";

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type RegisterUserRequest = {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
};

export type RegisterUserResponse = {
  message: string;
};

export type UserSortDirection = "asc" | "desc";
export type UserSortBy =
  | "full_name"
  | "email"
  | "role"
  | "is_active"
  | "created_at"
  | "updated_at"
  | "id";

export type ListUsersQuery = {
  sort?: UserSortDirection;
  sort_by?: UserSortBy;
  limit?: number;
};

export type ListUsersResponse = {
  users: User[];
};

export type SetUserActiveRequest = {
  user_id: string;
  is_active: boolean;
};

export type DeleteUserRequest = {
  user_id: string;
};

export type ChangePasswordRequest = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export type ChangePasswordResponse = {
  message: string;
};
