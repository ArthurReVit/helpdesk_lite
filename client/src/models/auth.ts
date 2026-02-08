export type AuthUserModel = {
  id: string;
  email: string;
  full_name: string;
  role: string;
};

export type LoginRequestModel = {
  email: string;
  password: string;
};

export type LoginResponseModel = {
  access_token: string;
  user: AuthUserModel;
};
