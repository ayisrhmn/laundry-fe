"use client";

import { DataTable } from "@/components/base/app-datatable";
import AppDropdownActions from "@/components/base/app-dropdown-actions";
import { AppHeading } from "@/components/base/app-heading";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useProductApi } from "@/lib/apis/product/product-hook";
import { safePromise } from "@/lib/utils";
import { formatMoney } from "@/lib/utils/money";
import { formatDate, getClockTime } from "@/lib/utils/time";
import { Plus, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import {
  confirmDeleteProductModal,
  formProductModal,
} from "./_module/components/product-modals.component";

export default function ProductPage() {
  const { useGetProducts, useDeleteProduct } = useProductApi();
  const { fetcher, limit, page, setLimit, setPage, handleSearch } = useGetProducts();
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const products = useMemo(() => {
    return fetcher?.data?.data ?? [];
  }, [fetcher?.data?.data]);

  const onRefresh = () => {
    fetcher?.refetch();
  };

  return (
    <div className="space-y-6">
      <AppHeading
        title="Daftar Produk"
        description="Kelola dan pantau semua produk yang tersedia di sistem POS Anda."
      />

      <DataTable<Product>
        columns={[
          {
            accessorKey: "sku",
            header: "SKU",
            cell: ({ row }) => <div className="text-sm">{row.original?.sku}</div>,
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
            accessorKey: "price",
            header: "Harga",
            cell: ({ row }) => <div className="text-sm">{formatMoney(row.original?.price)}</div>,
          },
          {
            accessorKey: "productType",
            header: "Kategori",
            cell: ({ row }) => (
              <div className="w-fit bg-primary px-3 py-1.5 rounded-full">
                <span className="text-sm text-white font-medium">{row.original?.type?.name}</span>
              </div>
            ),
          },
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
              <>
                {row.original?.status === "ACTIVE" && (
                  <div className="w-fit bg-green-500 px-3 py-1.5 rounded-full">
                    <span className="text-sm text-white font-medium">Aktif</span>
                  </div>
                )}
                {row.original?.status === "INACTIVE" && (
                  <div className="w-fit bg-destructive px-3 py-1.5 rounded-full">
                    <span className="text-sm text-white font-medium">Tidak Aktif</span>
                  </div>
                )}
                {row.original?.status === "ARCHIVED" && (
                  <div className="w-fit bg-gray-500 px-3 py-1.5 rounded-full">
                    <span className="text-sm text-white font-medium">Diarsipkan</span>
                  </div>
                )}
              </>
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
                onEdit={formProductModal(row.original, onRefresh).open}
                onDelete={
                  confirmDeleteProductModal({
                    requireType: row.original?.name?.trim(),
                    next: async () => {
                      await safePromise(async () => {
                        await deleteProduct(row.original?.id)
                          .then(() => {
                            toast({
                              title: "Produk berhasil dihapus",
                              description: "Produk telah berhasil dihapus.",
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
        data={products}
        headerChildren={
          <>
            <Button
              className="py-6 px-4 w-min"
              variant="outline"
              size="lg"
              onClick={formProductModal(undefined, onRefresh).open}
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
        noResultText="Belum ada produk yang ditambahkan"
      />
    </div>
  );
}
