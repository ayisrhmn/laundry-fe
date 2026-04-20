"use client";

import { User } from "@/@types/module/users/response";
import { DataTable } from "@/components/base/app-datatable";
import AppDropdownActions from "@/components/base/app-dropdown-actions";
import { AppHeading } from "@/components/base/app-heading";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUsersApi } from "@/lib/apis/users/users-hook";
import { cn, safePromise } from "@/lib/utils";
import { formatDate, getClockTime } from "@/lib/utils/time";
import { Filter, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import {
  filterUsersModal,
  UsersFilterValues,
} from "./_module/components/user-filter-modal.component";
import { confirmDeleteUserModal, formUserModal } from "./_module/components/user-modals.component";

export default function UsersPage() {
  const { useGetUsers, useDeleteUser } = useUsersApi();
  const [filters, setFilters] = useState<UsersFilterValues>({ sort: "newest" });
  const { fetcher, limit, page, setLimit, setPage, handleSearch } = useGetUsers({
    sort: filters.sort,
    role: filters.role,
  });
  const { mutateAsync: deleteUser } = useDeleteUser();

  const hasActiveFilters = filters.sort !== "newest" || filters.role;

  const users = useMemo(() => {
    return fetcher?.data?.data ?? [];
  }, [fetcher?.data?.data]);

  const onRefresh = () => {
    fetcher?.refetch();
  };

  return (
    <div className="space-y-6">
      <AppHeading
        title="User"
        description="Kelola dan pantau semua user yang tersedia di sistem Anda."
      />

      <DataTable<User>
        columns={[
          {
            accessorKey: "fullName",
            header: "Nama",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-semibold">{row.original?.fullName}</span>
                <span className="text-xs">@{row.original?.username}</span>
              </div>
            ),
          },
          {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => (
              <div
                className={cn(
                  "px-2 py-1 rounded-full w-fit",
                  row.original?.role === "ADMIN"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600",
                )}
              >
                <span className="text-xs font-semibold capitalize">
                  {row.original?.role?.toLowerCase()}
                </span>
              </div>
            ),
          },
          {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
              <div
                className={cn(
                  "text-sm font-semibold",
                  row.original?.isActive ? "text-green-600" : "text-red-600",
                )}
              >
                {row.original?.isActive ? "Aktif" : "Tidak Aktif"}
              </div>
            ),
          },
          {
            accessorKey: "createdAt",
            header: "Tanggal Dibuat",
            cell: ({ row }) => (
              <div className="flex flex-col items-start space-y-2">
                <p className="text-sm">{formatDate(row.original?.createdAt)}</p>
                <p className="text-xs text-gray-500">{getClockTime(row.getValue("createdAt"))}</p>
              </div>
            ),
          },
          {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
              <AppDropdownActions
                onEdit={formUserModal(row.original, onRefresh).open}
                onDelete={
                  confirmDeleteUserModal({
                    requireType: row.original?.username?.trim(),
                    next: async () => {
                      await safePromise(async () => {
                        await deleteUser(row.original?.id)
                          .then(() => {
                            toast({
                              title: "User berhasil dihapus",
                              description: `User "${row.original?.fullName}" berhasil dihapus.`,
                              variant: "success",
                            });
                          })
                          .finally(onRefresh);
                      });
                    },
                  }).open
                }
              />
            ),
            size: 20,
          },
        ]}
        data={users}
        headerChildren={
          <>
            <div className="relative">
              <Button
                className="py-6 px-4 w-min"
                variant="outline"
                size="lg"
                onClick={filterUsersModal(filters, setFilters).open}
              >
                <Filter className="h-4 w-4" />
                {hasActiveFilters && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </Button>
            </div>
            <Button className="py-6 px-4 w-min" variant="outline" size="lg" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </>
        }
        limit={limit}
        page={page}
        totalData={fetcher?.data?.pagination?.total || 0}
        searchPlaceholder="Cari berdasarkan Nama atau Username"
        onSearch={handleSearch}
        onLimitChanged={(limit) => {
          setLimit(limit);
        }}
        onPageChanged={(page) => {
          setPage(page);
        }}
        loading={fetcher?.isFetching}
        usePagination
        noResultText="Belum ada user yang ditambahkan"
      />
    </div>
  );
}
