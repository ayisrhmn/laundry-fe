"use client";

import { CustomerRequest } from "@/@types/module/customers/request";
import { Customer } from "@/@types/module/customers/response";
import { FormInput, FormTextArea } from "@/components/base/app-form";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useCustomersApi } from "@/lib/apis/customers/customers-hook";
import { createCustomerSchema, CreateCustomerSchema } from "@/lib/apis/customers/customers-schema";
import { safePromise } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { formatPhoneInput } from "../utils/phone";

export interface CustomerFormProps {
  item?: Customer;
  onRefresh?: () => void;
  onClose: () => void;
}

export default function CustomerForm({ item, onRefresh, onClose }: CustomerFormProps) {
  const { useCreateCustomer, useUpdateCustomer } = useCustomersApi();
  const { mutateAsync: createCustomer } = useCreateCustomer();
  const { mutateAsync: updateCustomer } = useUpdateCustomer();

  const form = useForm<CreateCustomerSchema>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      fullName: item?.fullName || "",
      phone: formatPhoneInput(item?.phone || ""),
      address: item?.address || "",
    },
  });

  const handleSubmit = async (data: CreateCustomerSchema) => {
    const payload: Partial<CustomerRequest> & { id?: string } = item?.id
      ? {
          id: item?.id,
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
        }
      : {
          fullName: data.fullName,
          phone: data.phone,
          address: data.address,
        };

    const [createdCustomer] = await safePromise(
      async () => {
        if (item?.id) {
          return await updateCustomer(payload as CustomerRequest & { id: string });
        }
        return await createCustomer(payload as CustomerRequest);
      },
      (err) => {
        toast({
          title: "Gagal memperbarui customer",
          description: err.message || "Pastikan semua field sudah terisi dengan benar.",
          variant: "destructive",
        });
        onClose();
      },
    );
    if (createdCustomer) {
      toast({
        title: "Customer berhasil diperbarui",
        description: "Data customer telah berhasil diperbarui.",
        variant: "success",
      });
      onRefresh?.();
      onClose();
    }
  };

  useEffect(() => {
    if (item?.id) {
      form.reset({
        fullName: item?.fullName || "",
        phone: formatPhoneInput(item?.phone || ""),
        address: item?.address || "",
      });
    }
  }, [item, form]);

  return (
    <div className="py-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => {
              return <FormInput label="Nama" placeholder="Masukkan nama" isRequired {...field} />;
            }}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => {
              return (
                <div className="flex flex-col space-y-1">
                  <FormInput
                    label="No. HP"
                    isRequired
                    type="text"
                    inputMode="tel"
                    placeholder="Masukkan nomor HP"
                    value={field.value}
                    onChange={(event) => field.onChange(formatPhoneInput(event.target.value))}
                  />
                  <span className="text-xs text-muted-foreground">
                    Format No. HP harus Indonesia, mis. +628123456789
                  </span>
                </div>
              );
            }}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => {
              return (
                <FormTextArea label="Alamat" placeholder="Masukkan alamat" isRequired {...field} />
              );
            }}
          />

          <div className="flex flex-row items-center justify-end space-x-2 mt-6!">
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
            <Button type="submit" isLoading={form.formState.isSubmitting}>
              {item?.id ? "Edit" : "Simpan"} Customer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
