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
