"use client";

import { Order } from "@/@types/module/orders/response";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useOrdersApi } from "@/lib/apis/orders/orders-hook";
import { safePromise } from "@/lib/utils";
import { formatDate } from "@/lib/utils/time";
import { ArrowRight, CheckCircle2, Circle, Lock, Printer, MessageCircle } from "lucide-react";
import { useState } from "react";

// --- EDIT ORDER STATUSES FORM ---
export function EditOrderStatusesForm({
  item,
  onRefresh,
  onClose,
}: {
  item: Order;
  onRefresh?: () => void;
  onClose: () => void;
}) {
  const { useUpdateOrder } = useOrdersApi();
  const { mutateAsync: updateOrder } = useUpdateOrder();
  const [orderStatus, setOrderStatus] = useState<"PENDING" | "DONE">(item.orderStatus);
  const [paymentStatus, setPaymentStatus] = useState<"UNPAID" | "PAID">(item.paymentStatus);
  const [loading, setLoading] = useState(false);

  const isOrderLocked = item.orderStatus === "DONE";
  const isPaymentLocked = item.paymentStatus === "PAID";

  const handleOrderDone = () => {
    if (isOrderLocked || paymentStatus === "UNPAID") return;
    setOrderStatus("DONE");
  };

  const handlePaymentPaid = () => {
    if (isPaymentLocked) return;
    setPaymentStatus("PAID");
  };

  const hasChanges = orderStatus !== item.orderStatus || paymentStatus !== item.paymentStatus;

  const handleSubmit = async () => {
    setLoading(true);
    const [res] = await safePromise(
      async () => {
        return await updateOrder({ id: item.id, orderStatus, paymentStatus });
      },
      (err) => {
        toast({
          title: "Gagal memperbarui status",
          description: err.message,
          variant: "destructive",
        });
      },
    );
    setLoading(false);
    if (res) {
      toast({
        title: "Status diperbarui",
        description: "Status pesanan dan pembayaran telah berhasil diperbarui.",
        variant: "success",
      });
      onRefresh?.();
      onClose();
    }
  };

  return (
    <div className="py-2 space-y-5">
      {/* Status Order */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Status Order
        </Label>
        <div className="flex items-center gap-2">
          {/* Step: Belum Diambil */}
          <div
            className={`flex items-center gap-2 flex-1 rounded-lg border px-3 py-2.5 transition-all ${
              orderStatus === "PENDING"
                ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                : "border-muted bg-muted/40 text-muted-foreground"
            }`}
          >
            {orderStatus === "PENDING" ? (
              <Circle className="h-4 w-4 shrink-0 fill-yellow-400 text-yellow-400" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">Belum Diambil</span>
          </div>

          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />

          {/* Step: Sudah Diambil */}
          <button
            type="button"
            disabled={isOrderLocked || paymentStatus === "UNPAID"}
            onClick={handleOrderDone}
            className={`flex items-center gap-2 flex-1 rounded-lg border px-3 py-2.5 transition-all ${
              orderStatus === "DONE"
                ? "border-blue-400 bg-blue-50 text-blue-700 cursor-default"
                : isOrderLocked || paymentStatus === "UNPAID"
                  ? "border-muted bg-muted/40 text-muted-foreground cursor-not-allowed opacity-50"
                  : "border-dashed border-blue-300 bg-blue-50/40 text-blue-600 hover:bg-blue-50 hover:border-blue-400 cursor-pointer"
            }`}
          >
            {orderStatus === "DONE" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
            ) : isOrderLocked || paymentStatus === "UNPAID" ? (
              <Lock className="h-4 w-4 shrink-0 text-muted-foreground/60" />
            ) : (
              <Circle className="h-4 w-4 shrink-0" />
            )}
            <span className="text-sm font-medium">Sudah Diambil</span>
          </button>
        </div>
      </div>

      {/* Status Pembayaran */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Status Pembayaran
        </Label>
        <div className="flex items-center gap-2">
          {/* Step: Belum Bayar */}
          <div
            className={`flex items-center gap-2 flex-1 rounded-lg border px-3 py-2.5 transition-all ${
              paymentStatus === "UNPAID"
                ? "border-red-400 bg-red-50 text-red-700"
                : "border-muted bg-muted/40 text-muted-foreground"
            }`}
          >
            {paymentStatus === "UNPAID" ? (
              <Circle className="h-4 w-4 shrink-0 fill-red-400 text-red-400" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">Belum Bayar</span>
          </div>

          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />

          {/* Step: Sudah Bayar */}
          <button
            type="button"
            disabled={isPaymentLocked}
            onClick={handlePaymentPaid}
            className={`flex items-center gap-2 flex-1 rounded-lg border px-3 py-2.5 transition-all ${
              paymentStatus === "PAID"
                ? "border-green-400 bg-green-50 text-green-700 cursor-default"
                : isPaymentLocked
                  ? "border-muted bg-muted/40 text-muted-foreground cursor-not-allowed"
                  : "border-dashed border-green-300 bg-green-50/40 text-green-600 hover:bg-green-50 hover:border-green-400 cursor-pointer"
            }`}
          >
            {paymentStatus === "PAID" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
            ) : isPaymentLocked ? (
              <Lock className="h-4 w-4 shrink-0" />
            ) : (
              <Circle className="h-4 w-4 shrink-0" />
            )}
            <span className="text-sm font-medium">Sudah Bayar</span>
          </button>
        </div>
      </div>

      {/* Info warning / pay first */}
      {paymentStatus === "UNPAID" && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200/50 rounded-md px-3 py-2">
          ⚠️ Pesanan belum lunas. Status harus diubah menjadi <strong>Sudah Bayar</strong> terlebih dahulu sebelum pesanan dapat ditandai sebagai <strong>Sudah Diambil</strong>.
        </p>
      )}

      <div className="flex flex-row items-center justify-end space-x-2 mt-2!">
        <Button variant="outline" onClick={onClose} type="button" disabled={loading}>
          Batal
        </Button>
        <Button onClick={handleSubmit} isLoading={loading} disabled={!hasChanges}>
          Simpan
        </Button>
      </div>
    </div>
  );
}

// --- ORDER DETAIL VIEW ---
export function OrderDetailView({ item, onClose }: { item: Order; onClose: () => void }) {
  return (
    <div className="py-2 space-y-6 max-h-[70vh] overflow-y-auto px-1 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 mb-1">No. Order</p>
          <p className="font-semibold">{item.orderNumber}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-1">Tanggal Pesanan</p>
          <p className="font-semibold">{formatDate(item.createdAt)}</p>
        </div>
        <div>
          <p className="text-gray-500 mb-2">Status Order</p>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              item.orderStatus === "DONE"
                ? "bg-blue-100 text-blue-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {item.orderStatus === "DONE" ? "Sudah Diambil" : "Belum Diambil"}
          </span>
        </div>
        <div>
          <p className="text-gray-500 mb-2">Status Pembayaran</p>
          <span
            className={`px-2 py-1 rounded text-xs font-semibold ${
              item.paymentStatus === "PAID"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {item.paymentStatus === "PAID" ? "Sudah Bayar" : "Belum Bayar"}
          </span>
        </div>
        <div className="col-span-2">
          <p className="text-gray-500 mb-1">Pelanggan</p>
          <p className="font-semibold">{item.customer?.fullName || item.customerId}</p>
          <p className="text-xs text-gray-500">{item.customer?.phone}</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="font-bold text-base border-b pb-2">Item Pesanan</p>
        {item.items?.map((orderItem) => (
          <div key={orderItem.id} className="flex justify-between items-center py-1">
            <div>
              <p className="font-semibold">{orderItem.serviceName}</p>
              <p className="text-xs text-gray-500">
                {orderItem.qty} {orderItem.serviceUnit} x Rp{" "}
                {orderItem.price.toLocaleString("id-ID")}
              </p>
            </div>
            <div className="font-semibold">Rp {orderItem.subtotal.toLocaleString("id-ID")}</div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between items-center">
          <p className="text-gray-500">Subtotal</p>
          <p className="font-semibold">Rp {item.subtotal?.toLocaleString("id-ID")}</p>
        </div>
        {item.discountAmount ? (
          <div className="flex justify-between items-center text-red-500">
            <p>Diskon {item.discountType === "PERCENTAGE" && `(${item.discountValue}%)`}</p>
            <p>- Rp {item.discountAmount.toLocaleString("id-ID")}</p>
          </div>
        ) : null}
        <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
          <p>Total Akhir</p>
          <p>Rp {item.totalPrice?.toLocaleString("id-ID")}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-6 border-t pt-4">
        <Button
          variant="outline"
          className="flex items-center justify-center gap-1.5 text-xs font-bold border-amber-300 text-amber-600 hover:bg-amber-50"
          type="button"
          onClick={() => {
            // TODO: Cetak Receipt
            toast({
              title: "Cetak Receipt",
              description: "Fitur cetak receipt sedang dalam pengembangan (TODO).",
            });
          }}
        >
          <Printer className="h-4 w-4" />
          Cetak Struk
        </Button>
        <Button
          variant="outline"
          className="flex items-center justify-center gap-1.5 text-xs font-bold border-green-300 text-green-600 hover:bg-green-50"
          type="button"
          onClick={() => {
            // TODO: Kirim Receipt ke WA
            toast({
              title: "Kirim WA",
              description: "Fitur kirim struk ke WhatsApp sedang dalam pengembangan (TODO).",
            });
          }}
        >
          <MessageCircle className="h-4 w-4" />
          Kirim WA
        </Button>
        <Button onClick={onClose} type="button" className="col-span-2 mt-1 font-bold">
          Tutup
        </Button>
      </div>
    </div>
  );
}
