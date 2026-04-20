"use client";

import { UserRequest } from "@/@types/module/users/request";
import { User } from "@/@types/module/users/response";
import { FormInput, FormSelectInput, FormSwitch } from "@/components/base/app-form";
import { Button } from "@/components/ui/button";
import { Form, FormField } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useUsersApi } from "@/lib/apis/users/users-hook";
import { UpdateUserSchema, updateUserSchema } from "@/lib/apis/users/users-schema";
import { safePromise } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export interface UserFormProps {
  item?: User;
  onRefresh?: () => void;
  onClose: () => void;
}

export default function UserForm({ item, onRefresh, onClose }: UserFormProps) {
  const { useUpdateUser } = useUsersApi();
  const { mutateAsync: updateUser } = useUpdateUser();

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: item?.fullName || "",
      password: "",
      confirmPassword: "",
      role: item?.role || "ADMIN",
      isActive: item?.isActive ?? true,
    },
  });

  const handleSubmit = async (data: UpdateUserSchema) => {
    // Password match validation
    if (data.password && data.password !== data.confirmPassword) {
      toast({
        title: "Password tidak cocok",
        description: "Password dan konfirmasi password harus sama.",
        variant: "destructive",
      });
      return;
    }

    const payload: Partial<UserRequest> & { id?: string } = {
      id: item?.id,
      fullName: data.fullName,
      role: data.role,
      isActive: data.isActive,
    };

    // Only include password if it's provided
    if (data.password) {
      payload.password = data.password;
    }

    const [updatedUser] = await safePromise(
      async () => {
        if (item?.id) {
          return await updateUser(payload as UserRequest & { id: string });
        }
      },
      (err) => {
        toast({
          title: "Gagal memperbarui user",
          description: err.message || "Pastikan semua field sudah terisi dengan benar.",
          variant: "destructive",
        });
        onClose();
      },
    );
    if (updatedUser) {
      toast({
        title: "User berhasil diperbarui",
        description: "Data user telah berhasil diperbarui.",
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
        password: "",
        confirmPassword: "",
        role: item?.role || "ADMIN",
        isActive: item?.isActive ?? true,
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
            name="role"
            render={({ field }) => {
              return (
                <FormSelectInput
                  label="Role"
                  isRequired
                  placeholder="Pilih role"
                  options={[
                    { value: "ADMIN", label: "Admin" },
                    { value: "OPERATOR", label: "Operator" },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                />
              );
            }}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => {
              return (
                <FormSwitch label="Status Aktif" value={field.value} onChange={field.onChange} />
              );
            }}
          />

          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold mb-3">Password (opsional untuk edit)</h4>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => {
                  return (
                    <FormInput
                      label="Password Baru"
                      placeholder="Masukkan password baru"
                      type="password"
                      {...field}
                    />
                  );
                }}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => {
                  return (
                    <FormInput
                      label="Konfirmasi Password"
                      placeholder="Konfirmasi password baru"
                      type="password"
                      {...field}
                    />
                  );
                }}
              />
            </div>
          </div>

          <div className="flex flex-row items-center justify-end space-x-2 mt-6!">
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
            <Button type="submit" isLoading={form.formState.isSubmitting}>
              {item?.id ? "Edit" : "Simpan"} User
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
