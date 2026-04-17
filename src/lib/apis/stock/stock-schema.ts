import z from "zod";

export const CreateStockSchema = z.object({
  productId: z.string({ error: "Produk wajib diisi" }).min(1, "Produk wajib diisi"),
  branchId: z.string({ error: "Cabang wajib diisi" }).min(1, "Cabang wajib diisi"),
  quantity: z.string({ error: "Kuantitas wajib diisi" }).min(1, "Kuantitas wajib diisi"),
});
export type CreateStock = z.infer<typeof CreateStockSchema>;
