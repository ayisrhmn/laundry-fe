import z from "zod";

export const CreateProductSchema = z.object({
  sku: z.string({ error: "SKU wajib diisi" }).min(1, "SKU wajib diisi"),
  name: z.string({ error: "Nama wajib diisi" }).min(1, "Nama wajib diisi"),
  description: z.string({ error: "Deskripsi wajib diisi" }).min(1, "Deskripsi wajib diisi"),
  price: z.string({ error: "Harga wajib diisi" }).min(1, "Harga wajib diisi"),
  typeId: z.string({ error: "Kategori produk wajib diisi" }).min(1, "Kategori produk wajib diisi"),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED"]).optional(),
});
export type CreateProduct = z.infer<typeof CreateProductSchema>;
