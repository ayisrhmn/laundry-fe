"use client";

import { ServiceRequest } from "@/@types/module/services/request";
import { Service } from "@/@types/module/services/response";
import { FormInput, FormMoneyInput, FormSelectInput } from "@/components/base/app-form";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useServicesApi } from "@/lib/apis/services/services-hook";
import { createServiceSchema, CreateServiceSchema } from "@/lib/apis/services/services-schema";
import { safePromise } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface ServiceFormProps {
  item?: Service;
  onRefresh?: () => void;
  onClose: () => void;
}

export default function ServiceForm({ item, onRefresh, onClose }: ServiceFormProps) {
  const { useCreateService, useUpdateService } = useServicesApi();
  const { mutateAsync: createService } = useCreateService();
  const { mutateAsync: updateService } = useUpdateService();

  const form = useForm<CreateServiceSchema>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      name: item?.name || "",
      unit: item?.unit || "KG",
      price: item?.price || 0,
    },
  });

  const handleSubmit = async (data: CreateServiceSchema) => {
    const payload: Partial<ServiceRequest> & { id?: string } = item?.id
      ? {
          id: item?.id,
          name: data.name,
          unit: data.unit,
          price: data.price,
        }
      : {
          name: data.name,
          unit: data.unit,
          price: data.price,
        };

    const [createdService] = await safePromise(
      async () => {
        if (item?.id) {
          return await updateService(payload as ServiceRequest & { id: string });
        }
        return await createService(payload as ServiceRequest);
      },
      (err) => {
        toast({
          title: "Gagal memperbarui layanan",
          description: err.message || "Pastikan semua field sudah terisi dengan benar.",
          variant: "destructive",
        });
        onClose();
      },
    );
    if (createdService) {
      toast({
        title: "Layanan berhasil diperbarui",
        description: "Data layanan telah berhasil diperbarui.",
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
        unit: item?.unit || "KG",
        price: item?.price || 0,
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
            render={({ field }) => {
              return <FormInput label="Nama" placeholder="Masukkan nama" isRequired {...field} />;
            }}
          />

          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => {
              return (
                <FormSelectInput
                  label="Unit"
                  isRequired
                  placeholder="Pilih unit"
                  options={[
                    { value: "KG", label: "Kg" },
                    { value: "ITEM", label: "Item" },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
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
                  placeholder="Masukkan harga"
                  isRequired
                  name={field.name}
                  value={field.value}
                  onBlur={field.onBlur}
                  onChange={(event) => {
                    const nextValue = event.target.value === "" ? 0 : Number(event.target.value);
                    field.onChange(Number.isNaN(nextValue) ? 0 : nextValue);
                  }}
                />
              );
            }}
          />

          <div className="flex flex-row items-center justify-end space-x-2 mt-6!">
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
            <Button type="submit" isLoading={form.formState.isSubmitting}>
              {item?.id ? "Edit" : "Simpan"} Layanan
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
