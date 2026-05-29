import { BaseApiResult } from "@/@types/apis.type";
import {
  RecentOrdersParams,
  RevenueTrendParams,
  TopCustomersParams,
  TopServicesParams,
} from "@/@types/module/dashboard/request";
import {
  DashboardSummary,
  DiscountSummary,
  OrderBreakdown,
  RecentOrderItem,
  RevenueTrendItem,
  TopCustomerItem,
  TopServiceItem,
} from "@/@types/module/dashboard/response";
import { BaseApi } from "@/lib/apis/base";

export class DashboardApi extends BaseApi {
  getSummary() {
    return this.get<BaseApiResult<DashboardSummary>>({
      url: `${this.endpoints.dashboard}/summary`,
    });
  }

  getRevenueTrend(params?: RevenueTrendParams) {
    return this.get<BaseApiResult<RevenueTrendItem[]>>({
      url: `${this.endpoints.dashboard}/revenue-trend`,
      query: {
        ...(params?.range && { range: params.range }),
      } as Record<string, string>,
    });
  }

  getOrderBreakdown() {
    return this.get<BaseApiResult<OrderBreakdown>>({
      url: `${this.endpoints.dashboard}/order-breakdown`,
    });
  }

  getTopServices(params?: TopServicesParams) {
    return this.get<BaseApiResult<TopServiceItem[]>>({
      url: `${this.endpoints.dashboard}/top-services`,
      query: {
        ...(params?.limit !== undefined && { limit: params.limit.toString() }),
      } as Record<string, string>,
    });
  }

  getTopCustomers(params?: TopCustomersParams) {
    return this.get<BaseApiResult<TopCustomerItem[]>>({
      url: `${this.endpoints.dashboard}/top-customers`,
      query: {
        ...(params?.limit !== undefined && { limit: params.limit.toString() }),
      } as Record<string, string>,
    });
  }

  getRecentOrders(params?: RecentOrdersParams) {
    return this.get<BaseApiResult<RecentOrderItem[]>>({
      url: `${this.endpoints.dashboard}/recent-orders`,
      query: {
        ...(params?.limit !== undefined && { limit: params.limit.toString() }),
      } as Record<string, string>,
    });
  }

  getDiscountSummary() {
    return this.get<BaseApiResult<DiscountSummary>>({
      url: `${this.endpoints.dashboard}/discount-summary`,
    });
  }
}
