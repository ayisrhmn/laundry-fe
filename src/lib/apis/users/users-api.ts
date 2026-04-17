import { BaseApiResult, BasePaginatedApiResult, PaginatedFilters } from "@/@types/apis.type";
import { UserRequest } from "@/@types/module/users/request";
import { User, UserRole } from "@/@types/module/users/response";
import { BaseApi } from "@/lib/apis/base";

export type UsersPaginateFilters = PaginatedFilters & { role?: UserRole };

export class UsersApi extends BaseApi {
  getUsers(params: UsersPaginateFilters) {
    return this.get<BasePaginatedApiResult<User[]>>({
      url: this.endpoints.users,
      query: {
        ...this.getPaginatedQuery(params),
        ...(params.role ? { role: params.role } : {}),
      } as Record<string, string>,
    });
  }

  getUser(id: string) {
    return this.get<BaseApiResult<User>>({
      url: `${this.endpoints.users}/${id}`,
    });
  }

  updateUser(data: UserRequest & { id: string }) {
    return this.patch<BaseApiResult<User>>({
      url: `${this.endpoints.users}/${data?.id}`,
      data: {
        fullName: data.fullName,
        password: data.password,
        role: data.role,
        isActive: data.isActive,
      },
    });
  }

  deleteUser(id: string) {
    return this.delete<BaseApiResult<void>>({
      url: `${this.endpoints.users}/${id}`,
    });
  }
}
