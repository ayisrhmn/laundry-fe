import { BaseApiResult, BasePaginatedApiResult, PaginatedFilters } from "@/@types/apis.type";
import { ServiceRequest } from "@/@types/module/services/request";
import { Service } from "@/@types/module/services/response";
import { BaseApi } from "@/lib/apis/base";

export class ServicesApi extends BaseApi {
  getServices(params: PaginatedFilters) {
    return this.get<BasePaginatedApiResult<Service[]>>({
      url: this.endpoints.services,
      query: {
        ...this.getPaginatedQuery(params),
      } as Record<string, string>,
    });
  }

  getService(id: string) {
    return this.get<BaseApiResult<Service>>({
      url: `${this.endpoints.services}/${id}`,
    });
  }

  createService(data: ServiceRequest) {
    return this.post<BaseApiResult<Service>>({
      url: this.endpoints.services,
      data,
    });
  }

  updateService(data: ServiceRequest & { id: string }) {
    const { id, ...rest } = data;
    return this.patch<BaseApiResult<Service>>({
      url: `${this.endpoints.services}/${id}`,
      data: rest,
    });
  }

  deleteService(id: string) {
    return this.delete<BaseApiResult<void>>({
      url: `${this.endpoints.services}/${id}`,
    });
  }
}
