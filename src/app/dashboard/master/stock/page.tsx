"use client";

import { DataTable } from "@/components/base/app-datatable";
import AppDropdownActions from "@/components/base/app-dropdown-actions";
import { AppHeading } from "@/components/base/app-heading";
import { Button } from "@/components/ui/button";
import { useStockApi } from "@/lib/apis/stock/stock-hook";
import { formatThousandSeparator, normalizeBackendValue } from "@/lib/utils/money";
import { formatDate, getClockTime } from "@/lib/utils/time";
import { Plus, RefreshCw } from "lucide-react";
import { useMemo } from "react";
import { formStockModal } from "./_module/components/stock-modals.component";

export default function StockPage() {
  const { useGetStocks } = useStockApi();
  const { data: dataStocks, isFetching, refetch } = useGetStocks();

  const stocks = useMemo(() => {
    return dataStocks?.data ?? [];
  }, [dataStocks?.data]);

  const onRefresh = () => {
    refetch();
  };

  return (
    <div className="space-y-6">
      <AppHeading
        title="Stok"
        description="Kelola persediaan produk agar stok selalu akurat dan terpantau."
      />

      <DataTable<Stock>
        columns={[
          {
            accessorKey: "product",
            header: "Produk",
            cell: ({ row }) => <div className="text-sm">{row.original?.product?.name}</div>,
          },
          {
            accessorKey: "branch",
            header: "Cabang",
            cell: ({ row }) => <div className="text-sm">{row.original?.branch?.name}</div>,
          },
          {
            accessorKey: "quantity",
            header: "Kuantitas",
            cell: ({ row }) => {
              const normalized = normalizeBackendValue(row.original?.quantity);
              const quantity = formatThousandSeparator(normalized);
              return <div className="text-sm">{quantity}</div>;
            },
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
                onEdit={formStockModal(row.original, onRefresh).open}
                hideDelete
              />
            ),
            size: 20,
          },
        ]}
        data={stocks}
        headerChildren={
          <div className="w-full flex items-center justify-end gap-2">
            <Button
              className="py-6 px-4 w-min"
              variant="outline"
              size="lg"
              onClick={formStockModal(undefined, onRefresh).open}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button className="py-6 px-4 w-min" variant="outline" size="lg" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        }
        loading={isFetching}
        noResultText="Belum ada stok yang ditambahkan"
      />
    </div>
  );
}
