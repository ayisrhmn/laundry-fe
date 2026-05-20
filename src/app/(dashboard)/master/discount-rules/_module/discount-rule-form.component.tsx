"use client";

import { DiscountRuleRequest } from "@/@types/module/discount-rules/request";
import { DiscountRule } from "@/@types/module/discount-rules/response";
import { FormInput, FormMoneyInput, FormSelectInput, FormSwitch } from "@/components/base/app-form";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useDiscountRulesApi } from "@/lib/apis/discount-rules/discount-rules-hook";
import {
  createDiscountRuleSchema,
  CreateDiscountRuleSchema,
} from "@/lib/apis/discount-rules/discount-rules-schema";
import { safePromise } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface DiscountRuleFormProps {
  item?: DiscountRule;
  onRefresh?: () => void;
  onClose: () => void;
}

export default function DiscountRuleForm({ item, onRefresh, onClose }: DiscountRuleFormProps) {
  const { useCreateDiscountRule, useUpdateDiscountRule } = useDiscountRulesApi();
  const { mutateAsync: createDiscountRule } = useCreateDiscountRule();
  const { mutateAsync: updateDiscountRule } = useUpdateDiscountRule();

  const form = useForm<CreateDiscountRuleSchema>({
    resolver: zodResolver(createDiscountRuleSchema),
    defaultValues: {
      name: item?.name || "",
      discountType: item?.discountType || "PERCENTAGE",
      discountValue: item?.discountValue || 0,
      minTransaction: item?.minTransaction || 0,
      maxDiscountAmount: item?.maxDiscountAmount || 0,
      isRepeatable: item?.isRepeatable ?? false,
    },
  });

  const discountType = form.watch("discountType");

  const handleSubmit = async (data: CreateDiscountRuleSchema) => {
    const payload: Partial<DiscountRuleRequest> & { id?: string } = item?.id
      ? {
          id: item?.id,
          name: data.name,
          discountType: data.discountType,
          discountValue: data.discountValue,
          minTransaction: data.minTransaction,
          maxDiscountAmount: data.discountType === "FIXED" ? 0 : (data.maxDiscountAmount ?? 0),
          isRepeatable: data.isRepeatable,
        }
      : {
          name: data.name,
          discountType: data.discountType,
          discountValue: data.discountValue,
          minTransaction: data.minTransaction,
          maxDiscountAmount: data.discountType === "FIXED" ? 0 : (data.maxDiscountAmount ?? 0),
          isRepeatable: data.isRepeatable,
        };

    const [updatedRule] = await safePromise(
      async () => {
        if (item?.id) {
          return await updateDiscountRule(payload as DiscountRuleRequest & { id: string });
        }
        return await createDiscountRule(payload as DiscountRuleRequest);
      },
      (err) => {
        toast({
          title: "Gagal memproses aturan diskon",
          description: err.message || "Pastikan semua field sudah terisi dengan benar.",
          variant: "destructive",
        });
        onClose();
      },
    );

    if (updatedRule) {
      toast({
        title: item?.id
          ? "Aturan diskon berhasil diperbarui"
          : "Aturan diskon berhasil ditambahkan",
        description: `Aturan diskon "${data.name}" telah berhasil disimpan.`,
        variant: "success",
      });
      onRefresh?.();
      onClose();
    }
  };

  useEffect(() => {
    if (item?.id) {
      form.reset({
        name: item?.name || "",
        discountType: item?.discountType || "PERCENTAGE",
        discountValue: item?.discountValue || 0,
        minTransaction: item?.minTransaction || 0,
        maxDiscountAmount: item?.maxDiscountAmount || 0,
        isRepeatable: item?.isRepeatable ?? false,
      });
    }
  }, [item, form]);

  return (
    <div className="py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormInput
                label="Nama Aturan Diskon"
                placeholder="Masukkan nama aturan diskon, misal: Diskon Gajian"
                isRequired
                {...field}
              />
            )}
          />

          <FormField
            control={form.control}
            name="discountType"
            render={({ field }) => (
              <FormSelectInput
                label="Tipe Diskon"
                isRequired
                placeholder="Pilih tipe diskon"
                options={[
                  { value: "PERCENTAGE", label: "Persentase (%)" },
                  { value: "FIXED", label: "Nominal Tetap (Rp)" },
                ]}
                value={field.value}
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue("discountValue", 0);
                }}
              />
            )}
          />

          {discountType === "PERCENTAGE" ? (
            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormInput
                  label="Nilai Diskon (%)"
                  placeholder="Masukkan persentase diskon, misal: 10"
                  isRequired
                  type="number"
                  min={1}
                  max={100}
                  value={field.value || ""}
                  onBlur={field.onBlur}
                  onChange={(event) => {
                    const nextValue = event.target.value === "" ? 0 : Number(event.target.value);
                    field.onChange(Number.isNaN(nextValue) ? 0 : nextValue);
                  }}
                />
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="discountValue"
              render={({ field }) => (
                <FormMoneyInput
                  label="Nilai Diskon (Rp)"
                  placeholder="Masukkan nominal diskon, misal: 10.000"
                  isRequired
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event) => {
                    const nextValue = event.target.value === "" ? 0 : Number(event.target.value);
                    field.onChange(Number.isNaN(nextValue) ? 0 : nextValue);
                  }}
                />
              )}
            />
          )}

          <FormField
            control={form.control}
            name="minTransaction"
            render={({ field }) => (
              <FormInput
                label="Minimal Jumlah Transaksi"
                placeholder="Masukkan minimal jumlah transaksi, misal: 5"
                isRequired
                type="number"
                min={1}
                value={field.value || ""}
                onBlur={field.onBlur}
                onChange={(event) => {
                  const nextValue = event.target.value === "" ? 0 : Number(event.target.value);
                  field.onChange(Number.isNaN(nextValue) ? 0 : nextValue);
                }}
              />
            )}
          />

          {discountType === "PERCENTAGE" && (
            <FormField
              control={form.control}
              name="maxDiscountAmount"
              render={({ field }) => (
                <FormMoneyInput
                  label="Maksimal Nilai Diskon (Rp)"
                  placeholder="Masukkan maksimal nilai diskon, misal: 20.000 (0 jika tidak dibatasi)"
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event) => {
                    const nextValue = event.target.value === "" ? 0 : Number(event.target.value);
                    field.onChange(Number.isNaN(nextValue) ? 0 : nextValue);
                  }}
                />
              )}
            />
          )}

          <FormField
            control={form.control}
            name="isRepeatable"
            render={({ field }) => (
              <FormSwitch
                label="Ulangi Kelipatan"
                description="Aktifkan jika diskon ini berlaku kelipatan dari minimal jumlah transaksi."
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <div className="flex flex-row items-center justify-end space-x-2 mt-6!">
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
            <Button type="submit" isLoading={form.formState.isSubmitting}>
              {item?.id ? "Edit" : "Simpan"} Aturan Diskon
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
