"use client";

import { TopCustomerItem } from "@/@types/module/dashboard/response";
import { DataTable } from "@/components/base/app-datatable";
import { formatMoney } from "@/lib/utils/money";

type DashboardTopCustomersProps = {
  data: TopCustomerItem[];
  isLoading: boolean;
};

export function DashboardTopCustomers({ data, isLoading }: DashboardTopCustomersProps) {
  return (
    <DataTable<TopCustomerItem>
      columns={[
        {
          accessorKey: "customerName",
          header: "Pelanggan",
          cell: ({ row }) => (
            <div className="flex flex-col space-y-0.5">
              <span className="text-sm font-semibold">{row.original.customerName}</span>
              <span className="text-xs text-muted-foreground">{row.original.phone}</span>
            </div>
          ),
        },
        {
          accessorKey: "transactionCount",
          header: "Transaksi",
          cell: ({ row }) => (
            <span className="text-sm font-medium">{row.original.transactionCount}x</span>
          ),
        },
        {
          accessorKey: "totalSpending",
          header: "Total Belanja",
          cell: ({ row }) => (
            <span className="text-sm font-bold">{formatMoney(row.original.totalSpending)}</span>
          ),
        },
      ]}
      data={data}
      totalData={data.length}
      headerChildren={<p className="leading-none font-semibold">Pelanggan Terbaik</p>}
      loading={isLoading}
      usePagination={false}
      noResultText="Belum ada data pelanggan."
    />
  );
}
