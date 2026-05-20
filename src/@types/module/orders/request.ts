import { PaginatedFilters } from "@/@types/apis.type";
import { OrderStatus, PaymentStatus } from "./response";

export type OrdersFilters = PaginatedFilters & {
  customerId?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: string; // ISO 8601
  dateTo?: string; // ISO 8601
  discountType?: "PERCENTAGE" | "FIXED";
  hasDiscount?: boolean;
  minAmount?: number;
  maxAmount?: number;
};

export type OrderItemRequest = {
  serviceId: string;
  qty: number;
};

export type CreateOrderRequest = {
  customerId: string;
  items: OrderItemRequest[];
  paymentStatus: PaymentStatus;
  manualDiscountType?: "PERCENTAGE" | "FIXED";
  manualDiscountValue?: number;
};

export type UpdateOrderRequest = {
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
};
