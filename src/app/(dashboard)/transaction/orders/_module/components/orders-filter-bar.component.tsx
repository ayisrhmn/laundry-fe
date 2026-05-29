"use client";

import { Customer } from "@/@types/module/customers/response";
import { OrdersFilters } from "@/@types/module/orders/request";
import { FlexibleSelect } from "@/components/base/app-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { customersApi } from "@/lib/apis";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  RefreshCw,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

function AmountInput({
  value,
  onChange,
  placeholder = "0",
}: {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
}) {
  const toDisplay = (v: number | undefined) =>
    v ? String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\./g, "").replace(/[^0-9]/g, "");
    onChange(raw ? Number(raw) : undefined);
  };

  return (
    <Input
      type="text"
      inputMode="numeric"
      className="h-8 text-xs"
      placeholder={placeholder}
      value={toDisplay(value)}
      onChange={handleChange}
    />
  );
}

function DatePickerInput({
  value,
  onChange,
  placeholder = "Pilih tanggal",
}: {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date>(() => (value ? parseDate(value) : new Date()));

  function parseDate(s: string): Date {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  const toIso = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  useEffect(() => {
    if (value) setMonth(parseDate(value));
  }, [value]);

  const displayLabel = value
    ? parseDate(value).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : undefined;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs",
            "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors",
            value && "border-primary text-primary",
          )}
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {displayLabel ?? placeholder}
          </span>
          {value ? (
            <X
              className="h-3 w-3 shrink-0 ml-1 opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onChange(undefined);
              }}
            />
          ) : (
            <CalendarIcon className="h-3 w-3 shrink-0 ml-1 opacity-40" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0 w-auto" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          month={month}
          onMonthChange={setMonth}
          selected={value ? parseDate(value) : undefined}
          onSelect={(date) => {
            onChange(date ? toIso(date) : undefined);
            if (date) setOpen(false);
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CustomerPickerSheet({
  open,
  onOpenChange,
  selectedId,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: string;
  onSelect: (customer: Customer | null) => void;
}) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const { data, isFetching } = useQuery({
    queryKey: ["customer-picker", { search: debouncedSearch, page, limit }],
    queryFn: () => customersApi.getCustomers({ search: debouncedSearch, page, limit }),
    enabled: open,
  });

  const customers = data?.data ?? [];
  const total = data?.pagination?.total ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="gap-0 p-0 flex flex-col">
        <SheetHeader className="p-4 border-b space-y-3 shrink-0">
          <SheetTitle>Pilih Pelanggan</SheetTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-8 h-9 text-sm pr-8"
              placeholder="Cari nama atau nomor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
            {search && (
              <button
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearch("")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </SheetHeader>

        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Clear selection */}
          <button
            className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b shrink-0"
            onClick={() => {
              onSelect(null);
              onOpenChange(false);
            }}
          >
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              {!selectedId && <Check className="h-3.5 w-3.5 text-primary" />}
            </div>
            <span className="text-sm text-muted-foreground">Semua Pelanggan</span>
          </button>

          {/* List */}
          <div className="flex-1 overflow-y-auto">
            {isFetching && customers.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <span className="text-sm text-muted-foreground">Memuat...</span>
              </div>
            ) : customers.length === 0 ? (
              <div className="flex items-center justify-center py-10">
                <span className="text-sm text-muted-foreground">Pelanggan tidak ditemukan</span>
              </div>
            ) : (
              customers.map((customer) => (
                <button
                  key={customer.id}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b last:border-b-0",
                    selectedId === customer.id && "bg-primary/5",
                  )}
                  onClick={() => {
                    onSelect(customer);
                    onOpenChange(false);
                  }}
                >
                  <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    {selectedId === customer.id && <Check className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{customer.fullName}</p>
                    <p className="text-xs text-muted-foreground">{customer.phone}</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t shrink-0">
              <span className="text-xs text-muted-foreground">{total} pelanggan</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs w-14 text-center tabular-nums">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={page >= totalPages || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface OrdersFilterBarProps {
  filters: OrdersFilters;
  onFiltersChange: (filters: OrdersFilters) => void;
  onRefresh?: () => void;
}

export function OrdersFilterBar({ filters, onFiltersChange, onRefresh }: OrdersFilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(
    () =>
      !!(
        filters.orderStatus ||
        filters.paymentStatus ||
        filters.dateFrom ||
        filters.dateTo ||
        filters.hasDiscount !== undefined ||
        filters.discountType ||
        filters.minAmount ||
        filters.maxAmount
      ),
  );
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(
    null,
  );

  useEffect(() => {
    if (!filters.customerId) setSelectedCustomer(null);
  }, [filters.customerId]);

  const hasAdvancedFilters = !!(
    filters.orderStatus ||
    filters.paymentStatus ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.hasDiscount !== undefined ||
    filters.discountType ||
    filters.minAmount ||
    filters.maxAmount
  );

  const hasAnyNonDefault =
    !!filters.search ||
    !!filters.customerId ||
    !!filters.orderStatus ||
    !!filters.paymentStatus ||
    !!filters.dateFrom ||
    !!filters.dateTo ||
    filters.hasDiscount !== undefined ||
    !!filters.discountType ||
    !!filters.minAmount ||
    !!filters.maxAmount ||
    filters.sort !== "newest";

  const set = <K extends keyof OrdersFilters>(key: K, value: OrdersFilters[K] | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const reset = () => {
    setSelectedCustomer(null);
    onFiltersChange({ sort: "newest" });
  };

  return (
    <div className="flex-1 space-y-2.5 min-w-0">
      {/* Primary filters */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-end">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">No. Pesanan</p>
          <div className="relative">
            <Input
              className="h-8 text-xs w-full sm:w-48 pr-6"
              placeholder="Cari no. pesanan..."
              value={filters.search || ""}
              onChange={(e) => set("search", e.target.value || undefined)}
            />
            {filters.search && (
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => set("search", undefined)}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Pelanggan</p>
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className={cn(
              "flex h-8 w-full sm:w-48 items-center justify-between rounded-md border border-input bg-background px-3 text-xs ring-offset-background",
              "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              "transition-colors truncate",
              selectedCustomer && "border-primary text-primary",
            )}
          >
            <span className="truncate">
              {selectedCustomer ? selectedCustomer.name : "Semua Pelanggan"}
            </span>
            {selectedCustomer ? (
              <X
                className="h-3 w-3 shrink-0 ml-1 opacity-60 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCustomer(null);
                  set("customerId", undefined);
                }}
              />
            ) : (
              <Search className="h-3 w-3 shrink-0 ml-1 opacity-40" />
            )}
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-xs text-muted-foreground font-medium">Urutan</p>
          <FlexibleSelect
            size="sm"
            className="w-full sm:w-48"
            options={[
              { value: "newest", label: "Terbaru" },
              { value: "oldest", label: "Terlama" },
            ]}
            value={filters.sort || "newest"}
            onValueChange={(v) => set("sort", v as "newest" | "oldest")}
          />
        </div>

        <div className="col-span-2 flex items-center gap-1.5 justify-end sm:ml-auto">
          {hasAnyNonDefault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={reset}
              className="h-8 px-2.5 text-muted-foreground hover:text-destructive"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Reset
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced((v) => !v)}
            className={cn(
              "h-8 px-2.5 relative",
              hasAdvancedFilters && "border-primary text-primary",
            )}
          >
            {hasAdvancedFilters && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            )}
            Filter Lanjutan
            {showAdvanced ? (
              <ChevronUp className="h-3.5 w-3.5 ml-1.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 ml-1.5" />
            )}
          </Button>
          {onRefresh && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onRefresh}
              title="Refresh data"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 border-t border-dashed">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Status Order</p>
            <FlexibleSelect
              className="w-full"
              size="sm"
              placeholder="Semua"
              options={[
                { value: "_all", label: "Semua" },
                { value: "PENDING", label: "Belum Diambil" },
                { value: "DONE", label: "Sudah Diambil" },
              ]}
              value={filters.orderStatus || "_all"}
              onValueChange={(v) => set("orderStatus", (v === "_all" ? undefined : v) as never)}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Status Bayar</p>
            <FlexibleSelect
              className="w-full"
              size="sm"
              placeholder="Semua"
              options={[
                { value: "_all", label: "Semua" },
                { value: "UNPAID", label: "Belum Bayar" },
                { value: "PAID", label: "Sudah Bayar" },
              ]}
              value={filters.paymentStatus || "_all"}
              onValueChange={(v) => set("paymentStatus", (v === "_all" ? undefined : v) as never)}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Tanggal Dari</p>
            <DatePickerInput
              value={filters.dateFrom}
              onChange={(v) => set("dateFrom", v)}
              placeholder="Dari tanggal..."
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Tanggal Sampai</p>
            <DatePickerInput
              value={filters.dateTo}
              onChange={(v) => set("dateTo", v)}
              placeholder="Sampai tanggal..."
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Diskon</p>
            <FlexibleSelect
              className="w-full"
              size="sm"
              placeholder="Semua"
              options={[
                { value: "_all", label: "Semua" },
                { value: "true", label: "Ada Diskon" },
                { value: "false", label: "Tidak Ada" },
              ]}
              value={
                filters.hasDiscount === undefined ? "_all" : filters.hasDiscount ? "true" : "false"
              }
              onValueChange={(v) =>
                set("hasDiscount", v === "true" ? true : v === "false" ? false : undefined)
              }
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Tipe Diskon</p>
            <FlexibleSelect
              className="w-full"
              size="sm"
              placeholder="Semua"
              options={[
                { value: "_all", label: "Semua" },
                { value: "PERCENTAGE", label: "Persentase" },
                { value: "FIXED", label: "Nominal" },
              ]}
              value={filters.discountType || "_all"}
              onValueChange={(v) => set("discountType", (v === "_all" ? undefined : v) as never)}
            />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Min. Harga (Rp)</p>
            <AmountInput value={filters.minAmount} onChange={(v) => set("minAmount", v)} />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Maks. Harga (Rp)</p>
            <AmountInput value={filters.maxAmount} onChange={(v) => set("maxAmount", v)} />
          </div>
        </div>
      )}

      <CustomerPickerSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        selectedId={filters.customerId}
        onSelect={(customer) => {
          if (customer) {
            setSelectedCustomer({ id: customer.id, name: customer.fullName });
            set("customerId", customer.id);
          } else {
            setSelectedCustomer(null);
            set("customerId", undefined);
          }
        }}
      />
    </div>
  );
}
