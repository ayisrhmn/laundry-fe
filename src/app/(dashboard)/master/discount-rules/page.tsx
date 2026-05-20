"use client";

import { DiscountRule } from "@/@types/module/discount-rules/response";
import { DataTable } from "@/components/base/app-datatable";
import AppDropdownActions from "@/components/base/app-dropdown-actions";
import { AppHeading } from "@/components/base/app-heading";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useDiscountRulesApi } from "@/lib/apis/discount-rules/discount-rules-hook";
import { safePromise } from "@/lib/utils";
import { formatThousandSeparator } from "@/lib/utils/money";
import { formatDate, getClockTime } from "@/lib/utils/time";
import { Filter, Plus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import {
  confirmDeleteDiscountRuleModal,
  filterDiscountRulesModal,
  formDiscountRuleModal,
  DiscountRulesFilterValues,
} from "./_module/discount-rule-modals.component";

export default function DiscountRulesPage() {
  const { useGetDiscountRules, useDeleteDiscountRule } = useDiscountRulesApi();
  const [filters, setFilters] = useState<DiscountRulesFilterValues>({ sort: "newest" });
  const { fetcher, limit, page, setLimit, setPage, handleSearch } = useGetDiscountRules({
    sort: filters.sort,
    discountType: filters.discountType,
  });
  const { mutateAsync: deleteDiscountRule } = useDeleteDiscountRule();

  const hasActiveFilters = filters.sort !== "newest" || !!filters.discountType;

  const discountRules = useMemo(() => {
    return fetcher?.data?.data ?? [];
  }, [fetcher?.data?.data]);

  const onRefresh = () => {
    fetcher?.refetch();
  };

  return (
    <div className="space-y-6">
      <AppHeading
        title="Aturan Diskon"
        description="Kelola dan pantau semua aturan diskon yang tersedia di sistem Anda."
      />

      <DataTable<DiscountRule>
        columns={[
          {
            accessorKey: "name",
            header: "Nama",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-medium">{row.original?.name}</span>
              </div>
            ),
          },
          {
            accessorKey: "discountType",
            header: "Tipe Diskon",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-1">
                <span className="text-sm capitalize">
                  {row.original?.discountType === "PERCENTAGE" ? "Persentase" : "Nominal Tetap"}
                </span>
              </div>
            ),
          },
          {
            accessorKey: "discountValue",
            header: "Nilai Diskon",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-1">
                <span className="text-sm">
                  {row.original?.discountType === "PERCENTAGE"
                    ? `${row.original?.discountValue}%`
                    : `Rp ${formatThousandSeparator(String(row.original?.discountValue))}`}
                </span>
              </div>
            ),
          },
          {
            accessorKey: "minTransaction",
            header: "Min. Transaksi",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-1">
                <span className="text-sm">
                  {row.original?.minTransaction} Transaksi
                </span>
              </div>
            ),
          },
          {
            accessorKey: "maxDiscountAmount",
            header: "Maksimal Diskon",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-1">
                <span className="text-sm">
                  {row.original?.maxDiscountAmount === 0
                    ? "Tidak Dibatasi"
                    : `Rp ${formatThousandSeparator(String(row.original?.maxDiscountAmount))}`}
                </span>
              </div>
            ),
          },
          {
            accessorKey: "isRepeatable",
            header: "Kelipatan",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-1">
                {row.original?.isRepeatable ? (
                  <span className="inline-flex items-center w-max px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                    Aktif
                  </span>
                ) : (
                  <span className="inline-flex items-center w-max px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    Tidak Aktif
                  </span>
                )}
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
                onEdit={formDiscountRuleModal(row.original, onRefresh).open}
                onDelete={
                  confirmDeleteDiscountRuleModal({
                    requireType: row.original?.name?.trim(),
                    next: async () => {
                      await safePromise(async () => {
                        await deleteDiscountRule(row.original?.id)
                          .then(() => {
                            toast({
                              title: "Aturan diskon berhasil dihapus",
                              description: `Aturan diskon "${row.original?.name}" berhasil dihapus.`,
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
        data={discountRules}
        headerChildren={
          <>
            <div className="relative">
              <Button
                className="py-6 px-4 w-min"
                variant="outline"
                size="lg"
                onClick={filterDiscountRulesModal(filters, setFilters).open}
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
            <Button
              className="py-6 px-4 w-min"
              variant="outline"
              size="lg"
              onClick={formDiscountRuleModal(undefined, onRefresh).open}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </>
        }
        limit={limit}
        page={page}
        totalData={fetcher?.data?.pagination?.total || 0}
        searchPlaceholder="Cari berdasarkan Nama Aturan Diskon ..."
        onSearch={handleSearch}
        onLimitChanged={(limit) => {
          setLimit(limit);
        }}
        onPageChanged={(page) => {
          setPage(page);
        }}
        loading={fetcher?.isFetching}
        usePagination
        noResultText="Belum ada aturan diskon yang ditambahkan"
      />
    </div>
  );
}
