import z from "zod";

export const createServiceSchema = z.object({
  name: z.string({ error: "Nama wajib diisi" }).min(1, "Nama wajib diisi"),
  unit: z.enum(["KG", "ITEM"], {
    message: "Unit harus diisi dengan 'KG' atau 'ITEM'",
  }),
  price: z.number({ error: "Harga wajib diisi" }).min(1, "Harga wajib diisi"),
});

export type CreateServiceSchema = z.infer<typeof createServiceSchema>;
