"use client";

import {
  FormInput,
  FormMoneyInput,
  FormSelectInput,
  FormTextArea,
} from "@/components/base/app-form";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useProductApi } from "@/lib/apis/product/product-hook";
import { CreateProduct, CreateProductSchema } from "@/lib/apis/product/product-schema";
import { safePromise } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProductTypes } from "../../../product-type/_module/hooks/use-product-types";
import { PRODUCT_STATUS } from "../constants";

export interface ProductFormProps {
  item?: Product;
  onRefresh?: () => void;
  onClose: () => void;
}

export default function ProductForm({ item, onRefresh, onClose }: ProductFormProps) {
  const { useCreateProduct, useUpdateProduct } = useProductApi();
  const { mutateAsync: createProduct } = useCreateProduct();
  const { mutateAsync: updateProduct } = useUpdateProduct();

  const { options, isLoading, isFetching, error, pagination, handleLoadMore } = useProductTypes();

  const form = useForm<CreateProduct>({
    resolver: zodResolver(CreateProductSchema),
    defaultValues: {
      sku: "",
      name: "",
      description: "",
      price: "",
      typeId: "",
      status: "ACTIVE",
    },
  });

  const handleSubmit = async (data: CreateProduct) => {
    const payload = item?.id ? { id: item?.id, ...data } : { ...data };

    const [createdProduct] = await safePromise(
      async () => {
        if (item?.id) {
          return await updateProduct(payload as CreateProduct & { id: string });
        }
        return await createProduct(payload);
      },
      (err) => {
        toast({
          title: "Gagal membuat produk",
          description: err.message || "Pastikan semua field sudah terisi dengan benar.",
          variant: "destructive",
        });
        onClose();
      },
    );
    if (createdProduct) {
      toast({
        title: "Produk berhasil disimpan",
        description: "Produk baru telah berhasil dibuat dan disimpan.",
        variant: "success",
      });
      onRefresh?.();
      onClose();
    }
  };

  useEffect(() => {
    if (item?.id) {
      form.setValue("name", item?.name);
      form.setValue("description", item?.description);
      form.setValue("sku", item?.sku);
      form.setValue("price", item?.price);
      form.setValue("status", item?.status);
      form.setValue("typeId", item?.type?.id);
    }
  }, [item]);

  return (
    <div className="py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => {
              return (
                <FormInput label="SKU" placeholder="Masukkan sku produk" isRequired {...field} />
              );
            }}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormInput label="Nama" placeholder="Masukkan nama produk" isRequired {...field} />
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
                  placeholder="Masukkan deskripsi produk"
                  isRequired
                  {...field}
                />
              );
            }}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => {
              return (
                <FormMoneyInput
                  label="Harga (Rp)"
                  placeholder="Masukkan harga produk"
                  isRequired
                  {...field}
                />
              );
            }}
          />
          <FormField
            control={form.control}
            name="typeId"
            render={({ field, formState: { errors } }) => {
              return (
                <FormSelectInput
                  label="Kategori Produk"
                  placeholder="Pilih kategori produk..."
                  searchPlaceholder="Cari kategori produk..."
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) {
                      field.onChange(value);
                    }
                  }}
                  options={options}
                  loading={isLoading}
                  error={error}
                  searchable
                  pagination={pagination}
                  onLoadMore={handleLoadMore}
                  loadingMore={isFetching}
                  emptyText="Belum ada kategori produk"
                  errorText="Gagal memuat kategori produk"
                  errorMsg={errors.typeId?.message}
                  isRequired
                />
              );
            }}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field, formState: { errors } }) => {
              return (
                <FormSelectInput
                  label="Status"
                  placeholder="Pilih status produk..."
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) {
                      field.onChange(value);
                    }
                  }}
                  options={PRODUCT_STATUS}
                  errorMsg={errors.typeId?.message}
                  isRequired
                />
              );
            }}
          />

          <div className="flex flex-row items-center justify-end space-x-2 !mt-6">
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
            <Button type="submit" isLoading={form.formState.isSubmitting}>
              {item?.id ? "Edit" : "Simpan"} Produk
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
