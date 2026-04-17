import z from "zod";

export const updateUserSchema = z.object({
  fullName: z.string({ error: "Nama wajib diisi" }).min(1, "Nama wajib diisi"),
  password: z.string({ message: "Password baru harus diisi" }).optional(),
  confirmPassword: z.string({ message: "Konfirmasi Password baru harus diisi" }).optional(),
  role: z.enum(["ADMIN", "OPERATOR"], {
    message: "Role harus diisi dengan 'ADMIN' atau 'OPERATOR'",
  }),
  isActive: z.boolean({ message: "Status aktif harus diisi" }),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
