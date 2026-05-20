import z from "zod";

export const createDiscountRuleSchema = z.object({
  name: z.string({ error: "Nama wajib diisi" }).min(1, "Nama wajib diisi"),
  minTransaction: z
    .number({ error: "Minimal jumlah transaksi wajib diisi" })
    .min(1, "Minimal jumlah transaksi tidak boleh kurang dari 1"),
  isRepeatable: z.boolean({ error: "Ulangi kelipatan wajib diisi" }),
  discountType: z.enum(["PERCENTAGE", "FIXED"], {
    message: "Tipe diskon harus 'PERCENTAGE' atau 'FIXED'",
  }),
  discountValue: z
    .number({ error: "Nilai diskon wajib diisi" })
    .min(1, "Nilai diskon minimal bernilai 1"),
  maxDiscountAmount: z
    .number({ error: "Maksimal nilai diskon wajib diisi" })
    .min(0, "Maksimal nilai diskon tidak boleh kurang dari 0")
    .optional(),
});

export type CreateDiscountRuleSchema = z.infer<typeof createDiscountRuleSchema>;
