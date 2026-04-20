"use client";

import { Service } from "@/@types/module/services/response";
import { DataTable } from "@/components/base/app-datatable";
import AppDropdownActions from "@/components/base/app-dropdown-actions";
import { AppHeading } from "@/components/base/app-heading";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useServicesApi } from "@/lib/apis/services/services-hook";
import { safePromise } from "@/lib/utils";
import { formatThousandSeparator } from "@/lib/utils/money";
import { formatDate, getClockTime } from "@/lib/utils/time";
import { Filter, Plus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import {
  confirmDeleteServiceModal,
  filterServicesModal,
  formServiceModal,
  ServicesFilterValues,
} from "./_module/service-modals.component";

export default function ServicesPage() {
  const { useGetServices, useDeleteService } = useServicesApi();
  const [filters, setFilters] = useState<ServicesFilterValues>({ sort: "newest" });
  const { fetcher, limit, page, setLimit, setPage, handleSearch } = useGetServices({
    sort: filters.sort,
  });
  const { mutateAsync: deleteService } = useDeleteService();

  const hasActiveFilters = filters.sort !== "newest";

  const services = useMemo(() => {
    return fetcher?.data?.data ?? [];
  }, [fetcher?.data?.data]);

  const onRefresh = () => {
    fetcher?.refetch();
  };

  return (
    <div className="space-y-6">
      <AppHeading
        title="Layanan"
        description="Kelola dan pantau semua layanan yang tersedia di sistem Anda."
      />

      <DataTable<Service>
        columns={[
          {
            accessorKey: "fullName",
            header: "Nama",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-1">
                <span className="text-sm">{row.original?.name}</span>
              </div>
            ),
          },
          {
            accessorKey: "price",
            header: "Harga (Rp)",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-1">
                <span className="text-sm capitalize">
                  {formatThousandSeparator(String(row.original?.price))} /{" "}
                  {row.original?.unit?.toLowerCase()}
                </span>
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
                onEdit={formServiceModal(row.original, onRefresh).open}
                onDelete={
                  confirmDeleteServiceModal({
                    requireType: row.original?.name?.trim(),
                    next: async () => {
                      await safePromise(async () => {
                        await deleteService(row.original?.id)
                          .then(() => {
                            toast({
                              title: "Layanan berhasil dihapus",
                              description: `Layanan "${row.original?.name}" berhasil dihapus.`,
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
        data={services}
        headerChildren={
          <>
            <div className="relative">
              <Button
                className="py-6 px-4 w-min"
                variant="outline"
                size="lg"
                onClick={filterServicesModal(filters, setFilters).open}
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
              onClick={formServiceModal(undefined, onRefresh).open}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </>
        }
        limit={limit}
        page={page}
        totalData={fetcher?.data?.pagination?.total || 0}
        searchPlaceholder="Cari berdasarkan Nama Layanan ..."
        onSearch={handleSearch}
        onLimitChanged={(limit) => {
          setLimit(limit);
        }}
        onPageChanged={(page) => {
          setPage(page);
        }}
        loading={fetcher?.isFetching}
        usePagination
        noResultText="Belum ada layanan yang ditambahkan"
      />
    </div>
  );
}
