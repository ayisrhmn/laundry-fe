import { DefaultSession } from "next-auth";
import { User } from "./module/users/response";

declare module "next-auth" {
  interface Session extends DefaultSession {
    expires: string;
    user: User;
    token: string;
    status: string;
  }
}
