import { z } from "zod";

export const registerSchema = z.object({
  username: z.string({ message: "Username harus diisi" }).min(1),
  password: z
    .string({ message: "Password harus diisi" })
    .min(8, "Password harus kurang lebih 8 karakter"),
  confirmPassword: z
    .string({ message: "Konfirmasi Password harus diisi" })
    .min(8, "Konfirmasi Password harus kurang lebih 8 karakter"),
  fullName: z.string({ message: "Nama harus diisi" }).min(1),
  role: z.enum(["ADMIN", "OPERATOR"], {
    message: "Role harus diisi dengan 'ADMIN' atau 'OPERATOR'",
  }),
});

export const loginSchema = z.object({
  username: z.string({ message: "Username harus diisi" }).min(1),
  password: z
    .string({
      message: "Password harus diisi",
    })
    .min(8, "Password harus diisi"),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
