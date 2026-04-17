import z from "zod";

export const CreateBranchSchema = z.object({
  code: z.string({ error: "Kode wajib diisi" }).min(1, "Kode wajib diisi"),
  name: z.string({ error: "Nama wajib diisi" }).min(1, "Nama wajib diisi"),
  address: z.string({ error: "Alamat wajib diisi" }).min(1, "Alamat wajib diisi"),
  userId: z.string(),
});
export type CreateBranch = z.infer<typeof CreateBranchSchema>;
