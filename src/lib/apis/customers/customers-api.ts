import { BaseApiResult, BasePaginatedApiResult, PaginatedFilters } from "@/@types/apis.type";
import { CustomerRequest } from "@/@types/module/customers/request";
import { Customer } from "@/@types/module/customers/response";
import { BaseApi } from "@/lib/apis/base";

export class CustomersApi extends BaseApi {
  getCustomers(params: PaginatedFilters) {
    return this.get<BasePaginatedApiResult<Customer[]>>({
      url: this.endpoints.customers,
      query: {
        ...this.getPaginatedQuery(params),
      } as Record<string, string>,
    });
  }

  getCustomer(id: string) {
    return this.get<BaseApiResult<Customer>>({
      url: `${this.endpoints.customers}/${id}`,
    });
  }

  createCustomer(data: CustomerRequest) {
    return this.post<BaseApiResult<Customer>>({
      url: this.endpoints.customers,
      data,
    });
  }

  updateCustomer(data: CustomerRequest & { id: string }) {
    const { id, ...rest } = data;
    return this.patch<BaseApiResult<Customer>>({
      url: `${this.endpoints.customers}/${id}`,
      data: rest,
    });
  }

  deleteCustomer(id: string) {
    return this.delete<BaseApiResult<void>>({
      url: `${this.endpoints.customers}/${id}`,
    });
  }
}
