"use client";

import { User } from "@/@types/module/users/response";
import { DataTable } from "@/components/base/app-datatable";
import AppDropdownActions from "@/components/base/app-dropdown-actions";
import { AppHeading } from "@/components/base/app-heading";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useUsersApi } from "@/lib/apis/users/users-hook";
import { safePromise } from "@/lib/utils";
import { formatDate, getClockTime } from "@/lib/utils/time";
import { RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { confirmDeleteUserModal, formUserModal } from "./_module/components/user-modals.component";

export default function UsersPage() {
  const { useGetUsers, useDeleteUser } = useUsersApi();
  const { fetcher, limit, page, setLimit, setPage, handleSearch } = useGetUsers();
  const { mutateAsync: deleteUser } = useDeleteUser();

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
              <div className="text-sm capitalize">{row.original?.role?.toLowerCase()}</div>
            ),
          },
          {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
              <div className="text-sm">{row.original?.isActive ? "Aktif" : "Tidak Aktif"}</div>
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
          <Button className="py-6 px-4 w-min" variant="outline" size="lg" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        }
        limit={limit}
        page={page}
        totalData={fetcher?.data?.pagination?.total || 0}
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
