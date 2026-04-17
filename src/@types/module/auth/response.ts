import { User } from "../users/response";

export type UserAuthorizedResult = {
  token: string;
  user: User;
};
