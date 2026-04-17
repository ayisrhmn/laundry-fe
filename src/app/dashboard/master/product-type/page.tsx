"use client";

import { DataTable } from "@/components/base/app-datatable";
import AppDropdownActions from "@/components/base/app-dropdown-actions";
import { AppHeading } from "@/components/base/app-heading";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useProductTypeApi } from "@/lib/apis/product-type/product-type-hook";
import { safePromise } from "@/lib/utils";
import { formatDate, getClockTime } from "@/lib/utils/time";
import { Plus, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import {
  confirmDeleteProductTypeModal,
  formProductTypeModal,
} from "./_module/components/product-type-modals.component";

export default function ProductTypePage() {
  const { useGetProductTypes, useDeleteProductType } = useProductTypeApi();
  const { fetcher, limit, page, setLimit, setPage, handleSearch } = useGetProductTypes();
  const { mutateAsync: deleteProductType } = useDeleteProductType();

  const productTypes = useMemo(() => {
    return fetcher?.data?.data ?? [];
  }, [fetcher?.data?.data]);

  const onRefresh = () => {
    fetcher?.refetch();
  };

  return (
    <div className="space-y-6">
      <AppHeading
        title="Kategori Produk"
        description="Kelola dan atur kategori produk untuk memudahkan pengelompokan di sistem POS."
      />

      <DataTable<ProductType>
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
            accessorKey: "description",
            header: "Deskripsi",
            cell: ({ row }) => <div className="text-sm">{row.original?.description}</div>,
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
                onEdit={formProductTypeModal(row.original, onRefresh).open}
                onDelete={
                  confirmDeleteProductTypeModal({
                    requireType: row.original?.name?.trim(),
                    next: async () => {
                      await safePromise(async () => {
                        await deleteProductType(row.original?.id)
                          .then(() => {
                            toast({
                              title: "Kategori produk berhasil dihapus",
                              description: "Kategori produk telah berhasil dihapus.",
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
        data={productTypes}
        headerChildren={
          <>
            <Button
              className="py-6 px-4 w-min"
              variant="outline"
              size="lg"
              onClick={formProductTypeModal(undefined, onRefresh).open}
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
        noResultText="Belum ada kategori produk yang ditambahkan"
      />
    </div>
  );
}
