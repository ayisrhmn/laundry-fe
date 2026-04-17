"use client";

import { FormInput, FormTextArea } from "@/components/base/app-form";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useProductTypeApi } from "@/lib/apis/product-type/product-type-hook";
import {
  CreateProductType,
  CreateProductTypeSchema,
} from "@/lib/apis/product-type/product-type-schema";
import { safePromise } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface ProductTypeFormProps {
  item?: ProductType;
  onRefresh?: () => void;
  onClose: () => void;
}

export default function ProductTypeForm({ item, onRefresh, onClose }: ProductTypeFormProps) {
  const { useCreateProductType, useUpdateProductType } = useProductTypeApi();
  const { mutateAsync: createProductType } = useCreateProductType();
  const { mutateAsync: updateProductType } = useUpdateProductType();

  const form = useForm<CreateProductType>({
    resolver: zodResolver(CreateProductTypeSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  const handleSubmit = async (data: CreateProductType) => {
    const payload = item?.id ? { id: item?.id, ...data } : { ...data };

    const [createdProductType] = await safePromise(
      async () => {
        if (item?.id) {
          return await updateProductType(payload as CreateProductType & { id: string });
        }
        return await createProductType(payload);
      },
      (err) => {
        toast({
          title: "Gagal membuat kategori produk",
          description: err.message || "Pastikan semua field sudah terisi dengan benar.",
          variant: "destructive",
        });
        onClose();
      },
    );
    if (createdProductType) {
      toast({
        title: "Kategori produk berhasil disimpan",
        description: "Kategori produk baru telah berhasil dibuat dan disimpan.",
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
      form.setValue("description", item?.description);
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
                <FormInput
                  label="Kode"
                  placeholder="Masukkan kode kategori produk"
                  isRequired
                  {...field}
                />
              );
            }}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormInput
                  label="Nama"
                  placeholder="Masukkan nama kategori produk"
                  isRequired
                  {...field}
                />
              );
            }}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormTextArea
                  label="Deskripsi"
                  placeholder="Masukkan deskripsi kategori produk"
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
              {item?.id ? "Edit" : "Simpan"} Kategori Produk
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
