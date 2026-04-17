import { UserRole } from "./response";

export type UserRequest = {
  fullName: string;
  password: string;
  role: UserRole;
  isActive: boolean;
};
