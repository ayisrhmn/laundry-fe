import { BaseApiResult, BasePaginatedApiResult, PaginatedFilters } from "@/@types/apis.type";
import { DiscountRuleRequest } from "@/@types/module/discount-rules/request";
import { DiscountRule, DiscountType } from "@/@types/module/discount-rules/response";
import { BaseApi } from "@/lib/apis/base";

export class DiscountRulesApi extends BaseApi {
  getDiscountRules(params: PaginatedFilters & { discountType?: DiscountType }) {
    return this.get<BasePaginatedApiResult<DiscountRule[]>>({
      url: this.endpoints.discountRules,
      query: {
        ...this.getPaginatedQuery(params),
        ...(params.discountType && { discountType: params.discountType }),
      } as Record<string, string>,
    });
  }

  getDiscountRule(id: string) {
    return this.get<BaseApiResult<DiscountRule>>({
      url: `${this.endpoints.discountRules}/${id}`,
    });
  }

  createDiscountRule(data: DiscountRuleRequest) {
    return this.post<BaseApiResult<DiscountRule>>({
      url: this.endpoints.discountRules,
      data,
    });
  }

  updateDiscountRule(data: DiscountRuleRequest & { id: string }) {
    const { id, ...rest } = data;
    return this.patch<BaseApiResult<DiscountRule>>({
      url: `${this.endpoints.discountRules}/${id}`,
      data: rest,
    });
  }

  deleteDiscountRule(id: string) {
    return this.delete<BaseApiResult<void>>({
      url: `${this.endpoints.discountRules}/${id}`,
    });
  }
}
