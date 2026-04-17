"use client";

import { FormMoneyInput, FormSelectInput } from "@/components/base/app-form";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useStockApi } from "@/lib/apis/stock/stock-hook";
import { CreateStock, CreateStockSchema } from "@/lib/apis/stock/stock-schema";
import { safePromise } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useBranches } from "../../../branch/_module/hooks/use-branches";
import { useProducts } from "../../../product/_module/hooks/use-products";

export interface StockFormProps {
  item?: Stock;
  onRefresh?: () => void;
  onClose: () => void;
}

export default function StockForm({ item, onRefresh, onClose }: StockFormProps) {
  const { useUpsertStock } = useStockApi();
  const { mutateAsync: upsertStock } = useUpsertStock();

  const {
    options: productOptions,
    isLoading: productIsLoading,
    isFetching: productIsFetching,
    error: productError,
    pagination: productPagination,
    handleLoadMore: productHandleLoadMore,
  } = useProducts();

  const {
    options: branchOptions,
    isLoading: branchIsLoading,
    isFetching: branchIsFetching,
    error: branchError,
    pagination: branchPagination,
    handleLoadMore: branchHandleLoadMore,
  } = useBranches();

  const form = useForm<CreateStock>({
    resolver: zodResolver(CreateStockSchema),
    defaultValues: {
      productId: "",
      branchId: "",
      quantity: "0",
    },
  });

  const handleSubmit = async (data: CreateStock) => {
    const payload = item?.id ? { id: item?.id, ...data } : { ...data };

    const [createdStock] = await safePromise(
      async () => {
        return await upsertStock(payload);
      },
      (err) => {
        toast({
          title: "Gagal membuat stok",
          description: err.message || "Pastikan semua field sudah terisi dengan benar.",
          variant: "destructive",
        });
        onClose();
      },
    );
    if (createdStock) {
      toast({
        title: "Stok berhasil disimpan",
        description: "Stok baru telah berhasil dibuat dan disimpan.",
        variant: "success",
      });
      onRefresh?.();
      onClose();
    }
  };

  useEffect(() => {
    if (item?.id) {
      form.setValue("productId", item?.product?.id);
      form.setValue("branchId", item?.branch?.id);
      form.setValue("quantity", item?.quantity);
    }
  }, [item]);

  return (
    <div className="py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="productId"
            render={({ field, formState: { errors } }) => {
              return (
                <FormSelectInput
                  label="Produk"
                  placeholder="Pilih produk..."
                  searchPlaceholder="Cari produk..."
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) {
                      field.onChange(value);
                    }
                  }}
                  options={productOptions}
                  loading={productIsLoading}
                  error={productError}
                  searchable
                  pagination={productPagination}
                  onLoadMore={productHandleLoadMore}
                  loadingMore={productIsFetching}
                  emptyText="Belum ada produk"
                  errorText="Gagal memuat produk"
                  errorMsg={errors.productId?.message}
                  isRequired
                />
              );
            }}
          />
          <FormField
            control={form.control}
            name="branchId"
            render={({ field, formState: { errors } }) => {
              return (
                <FormSelectInput
                  label="Cabang"
                  placeholder="Pilih cabang..."
                  searchPlaceholder="Cari cabang..."
                  value={field.value}
                  onValueChange={(value) => {
                    if (value) {
                      field.onChange(value);
                    }
                  }}
                  options={branchOptions}
                  loading={branchIsLoading}
                  error={branchError}
                  searchable
                  pagination={branchPagination}
                  onLoadMore={branchHandleLoadMore}
                  loadingMore={branchIsFetching}
                  emptyText="Belum ada cabang"
                  errorText="Gagal memuat cabang"
                  errorMsg={errors.branchId?.message}
                  isRequired
                />
              );
            }}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => {
              return (
                <FormMoneyInput
                  label="Kuantitas"
                  placeholder="Masukkan kuantitas"
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
              {item?.id ? "Edit" : "Simpan"} Stok
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
