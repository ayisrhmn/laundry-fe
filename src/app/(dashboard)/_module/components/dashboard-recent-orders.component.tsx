"use client";

import { RecentOrderItem } from "@/@types/module/dashboard/response";
import { DataTable } from "@/components/base/app-datatable";
import { formatMoney } from "@/lib/utils/money";
import { formatDate, getClockTime } from "@/lib/utils/time";

type OrderStatusBadgeProps = {
  status: RecentOrderItem["orderStatus"];
};

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const styles = status === "DONE" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700";
  const label = status === "DONE" ? "Sudah Diambil" : "Belum Diambil";
  return <span className={`px-2 py-1 rounded text-xs font-medium ${styles}`}>{label}</span>;
}

type PaymentStatusBadgeProps = {
  status: RecentOrderItem["paymentStatus"];
};

function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const styles = status === "PAID" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
  const label = status === "PAID" ? "Sudah Bayar" : "Belum Bayar";
  return <span className={`px-2 py-1 rounded text-xs font-medium ${styles}`}>{label}</span>;
}

type DashboardRecentOrdersProps = {
  data: RecentOrderItem[];
  isLoading: boolean;
};

export function DashboardRecentOrders({ data, isLoading }: DashboardRecentOrdersProps) {
  return (
    <DataTable<RecentOrderItem>
      columns={[
        {
          accessorKey: "orderNumber",
          header: "No. Pesanan",
          cell: ({ row }) => (
            <span className="text-sm font-medium">{row.original.orderNumber}</span>
          ),
        },
        {
          accessorKey: "customerName",
          header: "Pelanggan",
          cell: ({ row }) => <span className="text-sm">{row.original.customerName}</span>,
        },
        {
          accessorKey: "totalPrice",
          header: "Total",
          cell: ({ row }) => (
            <span className="text-sm font-bold">{formatMoney(row.original.totalPrice)}</span>
          ),
        },
        {
          accessorKey: "orderStatus",
          header: "Status Order",
          cell: ({ row }) => <OrderStatusBadge status={row.original.orderStatus} />,
        },
        {
          accessorKey: "paymentStatus",
          header: "Status Bayar",
          cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
        },
        {
          accessorKey: "createdAt",
          header: "Waktu",
          cell: ({ row }) => (
            <div className="flex flex-col space-y-0.5">
              <span className="text-sm">{formatDate(row.original.createdAt)}</span>
              <span className="text-xs text-muted-foreground">
                {getClockTime(row.original.createdAt)}
              </span>
            </div>
          ),
        },
      ]}
      data={data}
      totalData={data.length}
      headerChildren={<p className="leading-none font-semibold">Order Terbaru</p>}
      loading={isLoading}
      usePagination={false}
      noResultText="Belum ada order."
    />
  );
}
