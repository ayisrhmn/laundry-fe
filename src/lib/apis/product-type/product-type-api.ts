import { BaseApi } from "@/lib/apis/base";
import { CreateProductType } from "./product-type-schema";

export class ProductTypeApi extends BaseApi {
  getProductTypes(params: PaginatedFilters) {
    return this.get<BasePaginatedApiResult<ProductType[]>>({
      url: this.endpoints.productType,
      query: { ...this.getPaginatedQuery(params) } as Record<string, string>,
    });
  }

  createProductType(data: CreateProductType) {
    return this.post<BaseApiResult<ProductType>>({
      url: this.endpoints.productType,
      data,
    });
  }

  updateProductType(data: CreateProductType & { id: string }) {
    return this.put<BaseApiResult<ProductType>>({
      url: `${this.endpoints.productType}/${data?.id}`,
      data,
    });
  }

  deleteProductType(id: string) {
    return this.delete<BaseApiResult<void>>({
      url: `${this.endpoints.productType}/${id}`,
    });
  }
}
