"use client";

import { Order } from "@/@types/module/orders/response";
import {
  editOrderStatusesModal,
  viewOrderModal,
} from "@/app/(dashboard)/transaction/orders/_module/components/orders-modals.component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { useOrdersApi } from "@/lib/apis/orders/orders-hook";
import { formatDate } from "@/lib/utils/time";
import { CheckCircle2, Clock, DollarSign, Package, RefreshCw, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function CashierOrders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState<"ALL" | "PENDING" | "DONE">("ALL");
  const [paymentStatus, setPaymentStatus] = useState<"ALL" | "UNPAID" | "PAID">("ALL");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch orders using hook
  const { useGetInfiniteOrders } = useOrdersApi();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, isLoading, isFetching, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
    useGetInfiniteOrders({
      search: debouncedSearchQuery || undefined,
      orderStatus: orderStatus === "ALL" ? undefined : orderStatus,
      paymentStatus: paymentStatus === "ALL" ? undefined : paymentStatus,
      limit: 10,
      sort: "newest",
    });

  const orders = data?.pages.flatMap((page) => page.data) || [];
  const totalItems = data?.pages[0]?.pagination.total || 0;

  // Auto trigger load more using Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    const current = loadMoreRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleRefresh = () => {
    refetch();
  };

  const handleEditStatus = (item: Order) => {
    editOrderStatusesModal(item, refetch).open();
  };

  const handleViewDetail = (item: Order) => {
    viewOrderModal(item).open();
  };

  return (
    <div className="space-y-4">
      {/* Search & Refresh Section */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            className="pl-9 h-10 text-sm"
            placeholder="Cari No. Pesanan..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
          onClick={handleRefresh}
          disabled={isLoading || isFetching}
          title="Refresh data"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="space-y-2">
        {/* Status Order Filter */}
        <div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
            Status Pengambilan
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setOrderStatus("ALL");
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 border ${
                orderStatus === "ALL"
                  ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:bg-muted/50"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => {
                setOrderStatus("PENDING");
              }}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 border ${
                orderStatus === "PENDING"
                  ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <Clock className="h-3 w-3" />
              Belum Diambil
            </button>
            <button
              onClick={() => {
                setOrderStatus("DONE");
              }}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 border ${
                orderStatus === "DONE"
                  ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              Sudah Diambil
            </button>
          </div>
        </div>

        {/* Status Pembayaran Filter */}
        <div>
          <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">
            Status Pembayaran
          </p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => {
                setPaymentStatus("ALL");
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 border ${
                paymentStatus === "ALL"
                  ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:bg-muted/50"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => {
                setPaymentStatus("UNPAID");
              }}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 border ${
                paymentStatus === "UNPAID"
                  ? "bg-red-500 border-red-500 text-white shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <DollarSign className="h-3 w-3" />
              Belum Lunas
            </button>
            <button
              onClick={() => {
                setPaymentStatus("PAID");
              }}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 border ${
                paymentStatus === "PAID"
                  ? "bg-green-600 border-green-600 text-white shadow-sm"
                  : "bg-card border-border text-muted-foreground hover:bg-muted/50"
              }`}
            >
              <CheckCircle2 className="h-3 w-3" />
              Lunas
            </button>
          </div>
        </div>
      </div>

      {/* Orders List / Cards */}
      <div className="space-y-3">
        {isLoading ? (
          // Loading Skeletons
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="p-4 rounded-xl border border-border bg-card space-y-3">
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </div>
              <div className="space-y-1.5">
                <div className="h-5 w-40 bg-muted animate-pulse rounded" />
                <div className="h-3 w-48 bg-muted animate-pulse rounded" />
                <div className="h-3.5 w-full bg-muted animate-pulse rounded" />
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center pt-1">
                <div className="flex gap-1">
                  <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
                  <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
                </div>
                <div className="h-5 w-24 bg-muted animate-pulse rounded" />
              </div>
            </div>
          ))
        ) : orders.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-dashed border-border bg-card text-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-sm">Tidak ada transaksi</p>
              <p className="text-xs text-muted-foreground max-w-60">
                Belum ada pesanan yang sesuai dengan filter pencarian Anda.
              </p>
            </div>
          </div>
        ) : (
          // Cards
          orders.map((item) => {
            const isOrderDone = item.orderStatus === "DONE";
            const isPaymentPaid = item.paymentStatus === "PAID";
            const servicesSummary = item.items
              ?.map((oi) => `${oi.serviceName} (${oi.qty} ${oi.serviceUnit})`)
              .join(", ");

            return (
              <div
                key={item.id}
                onClick={() => handleViewDetail(item)}
                className="group relative flex flex-col p-4 rounded-xl border border-border bg-card hover:border-amber-400/50 shadow-xs hover:shadow-md transition-all cursor-pointer duration-300"
              >
                {/* Header Card */}
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-0.5">
                    <span className="text-xs font-mono font-bold text-amber-500">
                      {item.orderNumber}
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-foreground shrink-0">
                    Rp {item.totalPrice?.toLocaleString("id-ID")}
                  </span>
                </div>

                {/* Customer & Items */}
                <div className="space-y-1.5 mb-3 flex-1">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground truncate">
                      {item.customer?.fullName || "Pelanggan Umum"}
                    </h3>
                    <p className="text-xs text-muted-foreground">{item.customer?.phone || "-"}</p>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1 italic bg-muted/40 px-2 py-1 rounded">
                    {servicesSummary || "Tidak ada layanan"}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-border/60 mb-3" />

                {/* Badges & Actions */}
                <div
                  className="flex justify-between items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-1.5">
                    {/* Status Order Badge */}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isOrderDone ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {isOrderDone ? "Diambil" : "Belum Diambil"}
                    </span>

                    {/* Status Payment Badge */}
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isPaymentPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isPaymentPaid ? "Lunas" : "Belum Lunas"}
                    </span>
                  </div>

                  {/* Edit Status Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2.5 text-xs text-amber-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg flex items-center gap-1 font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:text-muted-foreground disabled:hover:bg-transparent"
                    onClick={() => handleEditStatus(item)}
                    disabled={isOrderDone}
                  >
                    {isOrderDone ? "Selesai (Terkunci)" : "Ubah Status"}
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Infinite Scroll Bottom Indicator */}
      <div ref={loadMoreRef} className="h-14 flex items-center justify-center pt-2 pb-4">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-bold animate-pulse">
            <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />
            Memuat pesanan lainnya...
          </div>
        )}
        {!hasNextPage && orders.length > 0 && (
          <p className="text-[10px] text-muted-foreground font-bold tracking-wide uppercase">
            Semua pesanan telah dimuat ({orders.length} dari {totalItems})
          </p>
        )}
      </div>
    </div>
  );
}
