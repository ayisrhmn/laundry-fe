"use client";

import { DataTable } from "@/components/base/app-datatable";
import AppDropdownActions from "@/components/base/app-dropdown-actions";
import { AppHeading } from "@/components/base/app-heading";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useBranchApi } from "@/lib/apis/branch/branch-hook";
import { safePromise } from "@/lib/utils";
import { formatDate, getClockTime } from "@/lib/utils/time";
import { Plus, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import {
  confirmDeleteBranchModal,
  formBranchModal,
} from "./_module/components/branch-modals.component";

export default function BranchPage() {
  const { useGetBranches, useDeleteBranch } = useBranchApi();
  const { fetcher, limit, page, setLimit, setPage, handleSearch } = useGetBranches();
  const { mutateAsync: deleteBranch } = useDeleteBranch();

  const branches = useMemo(() => {
    return fetcher?.data?.data ?? [];
  }, [fetcher?.data?.data]);

  const onRefresh = () => {
    fetcher?.refetch();
  };

  return (
    <div className="space-y-6">
      <AppHeading
        title="Cabang"
        description="Kelola dan pantau semua cabang yang tersedia di sistem POS Anda."
      />

      <DataTable<Branch>
        columns={[
          {
            accessorKey: "code",
            header: "Kode",
            cell: ({ row }) => <div className="text-sm">{row.original?.code}</div>,
          },
          {
            accessorKey: "name",
            header: "Nama",
            cell: ({ row }) => <div className="text-sm">{row.original?.name}</div>,
          },
          {
            accessorKey: "address",
            header: "Alamat",
            cell: ({ row }) => <div className="text-sm">{row.original?.address}</div>,
          },
          {
            accessorKey: "owner",
            header: "Owner",
            cell: ({ row }) => <div className="text-sm">{row.original?.user?.name}</div>,
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
                onEdit={formBranchModal(row.original, onRefresh).open}
                onDelete={
                  confirmDeleteBranchModal({
                    requireType: row.original?.name?.trim(),
                    next: async () => {
                      await safePromise(async () => {
                        await deleteBranch(row.original?.id)
                          .then(() => {
                            toast({
                              title: "Cabang berhasil dihapus",
                              description: "Cabang telah berhasil dihapus.",
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
        data={branches}
        headerChildren={
          <>
            <Button
              className="py-6 px-4 w-min"
              variant="outline"
              size="lg"
              onClick={formBranchModal(undefined, onRefresh).open}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button className="py-6 px-4 w-min" variant="outline" size="lg" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </>
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
        noResultText="Belum ada cabang yang ditambahkan"
      />
    </div>
  );
}
