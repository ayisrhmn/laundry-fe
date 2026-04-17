import { BaseApi } from "../base";
import { CreateProduct } from "./product-schema";

export class ProductApi extends BaseApi {
  getProducts(params: PaginatedFilters) {
    return this.get<BasePaginatedApiResult<Product[]>>({
      url: this.endpoints.product,
      query: { ...this.getPaginatedQuery(params) } as Record<string, string>,
    });
  }

  createProduct(data: CreateProduct) {
    return this.post<BaseApiResult<Product>>({
      url: this.endpoints.product,
      data,
    });
  }

  updateProduct(data: CreateProduct & { id: string }) {
    return this.put<BaseApiResult<Product>>({
      url: `${this.endpoints.product}/${data?.id}`,
      data,
    });
  }

  deleteProduct(id: string) {
    return this.delete<BaseApiResult<void>>({
      url: `${this.endpoints.product}/${id}`,
    });
  }
}
