import z from "zod";

export const CreateProductTypeSchema = z.object({
  code: z.string({ error: "Kode wajib diisi" }).min(1, "Kode wajib diisi"),
  name: z.string({ error: "Nama wajib diisi" }).min(1, "Nama wajib diisi"),
  description: z.string({ error: "Deskripsi wajib diisi" }).min(1, "Deskripsi wajib diisi"),
});
export type CreateProductType = z.infer<typeof CreateProductTypeSchema>;
