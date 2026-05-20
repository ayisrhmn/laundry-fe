import { BaseApiResult, BasePaginatedApiResult } from "@/@types/apis.type";
import {
  CreateOrderRequest,
  OrdersFilters,
  UpdateOrderRequest,
} from "@/@types/module/orders/request";
import { Order } from "@/@types/module/orders/response";
import { BaseApi } from "@/lib/apis/base";

export class OrdersApi extends BaseApi {
  getOrders(params: OrdersFilters) {
    const {
      customerId,
      orderStatus,
      paymentStatus,
      dateFrom,
      dateTo,
      discountType,
      hasDiscount,
      minAmount,
      maxAmount,
      ...paginatedParams
    } = params;

    return this.get<BasePaginatedApiResult<Order[]>>({
      url: this.endpoints.orders,
      query: {
        ...this.getPaginatedQuery(paginatedParams),
        ...(customerId && { customerId }),
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
        ...(discountType && { discountType }),
        ...(hasDiscount !== undefined && { hasDiscount: hasDiscount.toString() }),
        ...(minAmount !== undefined && { minAmount: minAmount.toString() }),
        ...(maxAmount !== undefined && { maxAmount: maxAmount.toString() }),
      } as Record<string, string>,
    });
  }

  getArchivedOrders(params: OrdersFilters) {
    const {
      customerId,
      orderStatus,
      paymentStatus,
      dateFrom,
      dateTo,
      discountType,
      hasDiscount,
      minAmount,
      maxAmount,
      ...paginatedParams
    } = params;

    return this.get<BasePaginatedApiResult<Order[]>>({
      url: `${this.endpoints.orders}/archived`,
      query: {
        ...this.getPaginatedQuery(paginatedParams),
        ...(customerId && { customerId }),
        ...(orderStatus && { orderStatus }),
        ...(paymentStatus && { paymentStatus }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
        ...(discountType && { discountType }),
        ...(hasDiscount !== undefined && { hasDiscount: hasDiscount.toString() }),
        ...(minAmount !== undefined && { minAmount: minAmount.toString() }),
        ...(maxAmount !== undefined && { maxAmount: maxAmount.toString() }),
      } as Record<string, string>,
    });
  }

  getOrder(id: string) {
    return this.get<BaseApiResult<Order>>({
      url: `${this.endpoints.orders}/${id}`,
    });
  }

  createOrder(data: CreateOrderRequest) {
    return this.post<BaseApiResult<Order>>({
      url: this.endpoints.orders,
      data,
    });
  }

  updateOrder(data: UpdateOrderRequest & { id: string }) {
    const { id, ...rest } = data;
    return this.patch<BaseApiResult<Order>>({
      url: `${this.endpoints.orders}/${id}`,
      data: rest,
    });
  }

  deleteOrder(id: string) {
    return this.delete<BaseApiResult<void>>({
      url: `${this.endpoints.orders}/${id}`,
    });
  }
}
