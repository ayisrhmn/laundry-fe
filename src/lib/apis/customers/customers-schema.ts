import z from "zod";

const indonesianPhoneRegex = /^\+628\d{7,11}$/;

export const createCustomerSchema = z.object({
  fullName: z.string({ error: "Nama wajib diisi" }).min(1, "Nama wajib diisi"),
  phone: z
    .string({ error: "No. HP wajib diisi" })
    .min(1, "No. HP wajib diisi")
    .regex(indonesianPhoneRegex, "Format No. HP harus Indonesia, mis. +628123456789"),
  address: z.string({ error: "Alamat wajib diisi" }).min(1, "Alamat wajib diisi"),
});

export type CreateCustomerSchema = z.infer<typeof createCustomerSchema>;
