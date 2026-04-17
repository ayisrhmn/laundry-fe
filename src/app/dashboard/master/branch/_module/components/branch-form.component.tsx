"use client";

import { FormInput, FormTextArea } from "@/components/base/app-form";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useBranchApi } from "@/lib/apis/branch/branch-hook";
import { CreateBranch, CreateBranchSchema } from "@/lib/apis/branch/branch-schema";
import { safePromise } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface BranchFormProps {
  item?: Branch;
  onRefresh?: () => void;
  onClose: () => void;
}

export default function BranchForm({ item, onRefresh, onClose }: BranchFormProps) {
  const { data: session } = useSession();

  const { useCreateBranch, useUpdateBranch } = useBranchApi();
  const { mutateAsync: createBranch } = useCreateBranch();
  const { mutateAsync: updateBranch } = useUpdateBranch();

  const form = useForm<CreateBranch>({
    resolver: zodResolver(CreateBranchSchema),
    defaultValues: {
      code: "",
      name: "",
      address: "",
      userId: session?.user?.id,
    },
  });

  const handleSubmit = async (data: CreateBranch) => {
    const payload = item?.id ? { id: item?.id, ...data } : { ...data };

    const [createdBranch] = await safePromise(
      async () => {
        if (item?.id) {
          return await updateBranch(payload as CreateBranch & { id: string });
        }
        return await createBranch(payload);
      },
      (err) => {
        toast({
          title: "Gagal membuat cabang",
          description: err.message || "Pastikan semua field sudah terisi dengan benar.",
          variant: "destructive",
        });
        onClose();
      },
    );
    if (createdBranch) {
      toast({
        title: "Cabang berhasil disimpan",
        description: "Cabang baru telah berhasil dibuat dan disimpan.",
        variant: "success",
      });
      onRefresh?.();
      onClose();
    }
  };

  useEffect(() => {
    if (item?.id) {
      form.setValue("code", item?.code);
      form.setValue("name", item?.name);
      form.setValue("address", item?.address);
    }
  }, [item]);

  return (
    <div className="py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => {
              return (
                <FormInput label="Kode" placeholder="Masukkan kode cabang" isRequired {...field} />
              );
            }}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormInput label="Nama" placeholder="Masukkan nama cabang" isRequired {...field} />
              );
            }}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => {
              return (
                <FormTextArea
                  label="Alamat"
                  placeholder="Masukkan alamat cabang"
                  isRequired
                  {...field}
                />
              );
            }}
          />

          <div className="flex flex-row items-center justify-end space-x-2 !mt-6">
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
            <Button type="submit" isLoading={form.formState.isSubmitting}>
              {item?.id ? "Edit" : "Simpan"} Cabang
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
