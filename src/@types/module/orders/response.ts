import { Customer } from "../customers/response";
import { DiscountRule, DiscountSource, DiscountType } from "../discount-rules/response";
import { User } from "../users/response";

export type OrderStatus = "PENDING" | "DONE";

export type PaymentStatus = "UNPAID" | "PAID";

export type OrderItem = {
  id: string;
  serviceId: string;
  serviceName: string;
  serviceUnit: string;
  qty: number;
  price: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: Customer;
  createdBy?: User;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  subtotal: number;
  discountType: DiscountType | null;
  discountValue: number | null;
  discountAmount: number | null;
  discountSource: DiscountSource | null;
  discountRule: DiscountRule | null;
  totalPrice: number;
  items: OrderItem[];
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};
