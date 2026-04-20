"use client";

import { Customer } from "@/@types/module/customers/response";
import { DataTable } from "@/components/base/app-datatable";
import AppDropdownActions from "@/components/base/app-dropdown-actions";
import { AppHeading } from "@/components/base/app-heading";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useCustomersApi } from "@/lib/apis/customers/customers-hook";
import { safePromise } from "@/lib/utils";
import { formatDate, getClockTime } from "@/lib/utils/time";
import { Filter, Plus, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CustomersFilterValues,
  filterCustomersModal,
} from "./_module/customer-filter-modal.component";
import { confirmDeleteCustomerModal, formCustomerModal } from "./_module/customer-modals.component";

export default function CustomersPage() {
  const { useGetCustomers, useDeleteCustomer } = useCustomersApi();
  const [filters, setFilters] = useState<CustomersFilterValues>({ sort: "newest" });
  const { fetcher, limit, page, setLimit, setPage, handleSearch } = useGetCustomers({
    sort: filters.sort,
  });
  const { mutateAsync: deleteCustomer } = useDeleteCustomer();

  const hasActiveFilters = filters.sort !== "newest";

  const customers = useMemo(() => {
    return fetcher?.data?.data ?? [];
  }, [fetcher?.data?.data]);

  const onRefresh = () => {
    fetcher?.refetch();
  };

  return (
    <div className="space-y-6">
      <AppHeading
        title="Customer"
        description="Kelola dan pantau semua customer yang tersedia di sistem Anda."
      />

      <DataTable<Customer>
        columns={[
          {
            accessorKey: "fullName",
            header: "Nama",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-1">
                <span className="text-sm font-semibold">{row.original?.fullName}</span>
                <span className="text-xs">{row.original?.phone}</span>
              </div>
            ),
          },
          {
            accessorKey: "address",
            header: "Alamat",
            cell: ({ row }) => (
              <div className="flex flex-col space-y-1">
                <span className="text-sm">{row.original?.address}</span>
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
                onEdit={formCustomerModal(row.original, onRefresh).open}
                onDelete={
                  confirmDeleteCustomerModal({
                    requireType: row.original?.fullName?.trim(),
                    next: async () => {
                      await safePromise(async () => {
                        await deleteCustomer(row.original?.id)
                          .then(() => {
                            toast({
                              title: "Customer berhasil dihapus",
                              description: `Customer "${row.original?.fullName}" berhasil dihapus.`,
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
        data={customers}
        headerChildren={
          <>
            <div className="relative">
              <Button
                className="py-6 px-4 w-min"
                variant="outline"
                size="lg"
                onClick={filterCustomersModal(filters, setFilters).open}
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
              onClick={formCustomerModal(undefined, onRefresh).open}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </>
        }
        limit={limit}
        page={page}
        totalData={fetcher?.data?.pagination?.total || 0}
        searchPlaceholder="Cari berdasarkan Nama atau No. HP ..."
        onSearch={handleSearch}
        onLimitChanged={(limit) => {
          setLimit(limit);
        }}
        onPageChanged={(page) => {
          setPage(page);
        }}
        loading={fetcher?.isFetching}
        usePagination
        noResultText="Belum ada customer yang ditambahkan"
      />
    </div>
  );
}
