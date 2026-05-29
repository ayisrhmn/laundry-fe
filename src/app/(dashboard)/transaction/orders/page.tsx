"use client";

import { OrdersFilters } from "@/@types/module/orders/request";
import { Order } from "@/@types/module/orders/response";
import { DataTable } from "@/components/base/app-datatable";
import AppDropdownActions from "@/components/base/app-dropdown-actions";
import { AppHeading } from "@/components/base/app-heading";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";
import { useOrdersApi } from "@/lib/apis/orders/orders-hook";
import { safePromise } from "@/lib/utils";
import { formatDate, getClockTime } from "@/lib/utils/time";
import { Eye, Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { OrdersFilterBar } from "./_module/components/orders-filter-bar.component";
import {
  confirmDeleteOrderModal,
  editOrderStatusesModal,
  viewOrderModal,
} from "./_module/components/orders-modals.component";

export default function OrdersPage() {
  const { useGetOrders, useDeleteOrder } = useOrdersApi();
  const [filters, setFilters] = useState<OrdersFilters>({ sort: "newest" });

  const { fetcher, limit, page, setLimit, setPage } = useGetOrders(filters);
  const { mutateAsync: deleteOrder } = useDeleteOrder();

  const orders = useMemo(() => {
    return fetcher?.data?.data ?? [];
  }, [fetcher?.data?.data]);

  const onRefresh = () => {
    fetcher?.refetch();
  };

  return (
    <div className="space-y-6">
      <AppHeading
        title="Order"
        description="Kelola dan pantau semua transaksi yang masuk ke sistem Anda."
      />

      <DataTable<Order>
        columns={[
          {
            accessorKey: "orderNumber",
            header: "No. Pesanan",
            cell: ({ row }) => (
              <span className="text-sm font-medium">{row.original?.orderNumber}</span>
            ),
          },
          {
            accessorKey: "customer",
            header: "Pelanggan",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-semibold">
                  {row.original?.customer?.fullName || row.original?.customerId}
                </span>
                <span className="text-xs">{row.original?.customer?.phone}</span>
              </div>
            ),
          },
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-2">
                <span className="text-sm font-semibold">
                  Order:{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      row.original?.orderStatus === "DONE"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {row.original?.orderStatus === "DONE" ? "Sudah Diambil" : "Belum Diambil"}
                  </span>
                </span>
                <span className="text-sm font-semibold">
                  Bayar:{" "}
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      row.original?.paymentStatus === "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {row.original?.paymentStatus === "PAID" ? "Sudah Bayar" : "Belum Bayar"}
                  </span>
                </span>
              </div>
            ),
          },
          {
            accessorKey: "totalPrice",
            header: "Total Harga",
            cell: ({ row }) => (
              <span className="text-sm font-bold">
                Rp {row.original?.totalPrice?.toLocaleString("id-ID")}
              </span>
            ),
          },
          {
            accessorKey: "createdAt",
            header: "Tanggal Pesanan",
            cell: ({ row }) => (
              <div className="flex flex-col items-start space-y-1">
                <p className="text-sm">{formatDate(row.original?.createdAt)}</p>
                <p className="text-xs text-gray-500">{getClockTime(row.original?.createdAt)}</p>
              </div>
            ),
          },
          {
            id: "actions",
            header: "Aksi",
            cell: ({ row }) => (
              <AppDropdownActions
                hideEdit={true}
                menuItemChildren={
                  <>
                    <DropdownMenuItem
                      className="flex cursor-pointer flex-row items-center"
                      onClick={viewOrderModal(row.original).open}
                    >
                      <Eye className="h-4 w-4 mr-3" />
                      <span className="text-sm">Lihat Detail</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="flex cursor-pointer flex-row items-center"
                      onClick={editOrderStatusesModal(row.original, onRefresh).open}
                      disabled={row.original?.orderStatus === "DONE"}
                    >
                      <Pencil className="h-4 w-4 mr-3" />
                      <span className="text-sm">
                        Ubah Status {row.original?.orderStatus === "DONE" && "(Terkunci)"}
                      </span>
                    </DropdownMenuItem>
                  </>
                }
                onDelete={
                  confirmDeleteOrderModal({
                    requireType: row.original?.orderNumber,
                    next: async () => {
                      await safePromise(async () => {
                        await deleteOrder(row.original?.id)
                          .then(() => {
                            toast({
                              title: "Pesanan berhasil dibatalkan",
                              description: `Pesanan "${row.original?.orderNumber}" berhasil dibatalkan.`,
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
        data={orders}
        headerChildren={
          <OrdersFilterBar filters={filters} onFiltersChange={setFilters} onRefresh={onRefresh} />
        }
        limit={limit}
        page={page}
        totalData={fetcher?.data?.pagination?.total || 0}
        onLimitChanged={(limit) => {
          setLimit(limit);
        }}
        onPageChanged={(page) => {
          setPage(page);
        }}
        loading={fetcher?.isFetching}
        usePagination
        noResultText="Belum ada pesanan yang ditemukan"
      />
    </div>
  );
}
