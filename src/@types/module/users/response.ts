export type UserRole = "ADMIN" | "OPERATOR";

export type User = {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  token?: string;
};
