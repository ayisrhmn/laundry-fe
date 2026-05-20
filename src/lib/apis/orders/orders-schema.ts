import z from "zod";

export const getOrdersSchema = z.object({
  customerId: z.string().optional(),
  orderStatus: z.enum(["PENDING", "DONE"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID"]).optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  hasDiscount: z.boolean().optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
});

export type GetOrdersSchema = z.infer<typeof getOrdersSchema>;

export const orderItemSchema = z.object({
  serviceId: z.string({ error: "Layanan wajib dipilih" }).min(1, "Layanan wajib dipilih"),
  qty: z.number({ error: "Kuantitas wajib diisi" }).min(0.1, "Kuantitas minimal 0.1"),
});

export const createOrderSchema = z.object({
  customerId: z.string({ error: "Pelanggan wajib dipilih" }).min(1, "Pelanggan wajib dipilih"),
  items: z.array(orderItemSchema).min(1, "Minimal pilih 1 layanan"),
  paymentStatus: z.enum(["UNPAID", "PAID"]),
  manualDiscountType: z.enum(["PERCENTAGE", "FIXED"]).optional(),
  manualDiscountValue: z.number().optional(),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = z.object({
  orderStatus: z.enum(["PENDING", "DONE"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID"]).optional(),
});

export type UpdateOrderSchema = z.infer<typeof updateOrderSchema>;
