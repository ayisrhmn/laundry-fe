import { BaseApiResult } from "@/@types/apis.type";
import { UserAuthorizedResult } from "@/@types/module/auth/response";
import { BaseApi } from "@/lib/apis/base";
import { LoginSchema, RegisterSchema } from "./auth-schema";

export class AuthApi extends BaseApi {
  login(username: string, password: string) {
    return this.post<BaseApiResult<UserAuthorizedResult>, LoginSchema>({
      url: this.endpoints.auth.login,
      data: { username, password },
    });
  }

  register(data: RegisterSchema) {
    return this.post<BaseApiResult<UserAuthorizedResult>, RegisterSchema>({
      url: this.endpoints.auth.register,
      data,
    });
  }
}
