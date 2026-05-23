"use client";

import { useState, useEffect } from "react";
import { useCustomersApi } from "@/lib/apis/customers/customers-hook";
import { useServicesApi } from "@/lib/apis/services/services-hook";
import { useOrdersApi } from "@/lib/apis/orders/orders-hook";
import { Customer } from "@/@types/module/customers/response";
import { Service } from "@/@types/module/services/response";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CashierOrders } from "./cashier-orders.component";
import { FlexibleSelect } from "@/components/base/app-select";
import {
  Search,
  UserPlus,
  ArrowRight,
  Plus,
  Tag,
  ShoppingBag,
  ListFilter,
  UserCheck,
  X,
} from "lucide-react";

type CartItem = {
  serviceId: string;
  name: string;
  price: number;
  unit: string;
  qty: number | string;
};

export default function CashierView() {
  const parseQty = (qty: number | string) => {
    if (typeof qty === "number") return qty;
    const parsed = parseFloat(qty);
    return isNaN(parsed) ? 0 : parsed;
  };

  const [activeTab, setActiveTab] = useState<"pos" | "orders">("pos");
  
  // --- Customer State ---
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newCustomerAddress, setNewCustomerAddress] = useState("");
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

  // --- Cart State ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckoutDialog, setShowCheckoutDialog] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"UNPAID" | "PAID">("UNPAID");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // --- API Hooks ---
  const { useGetCustomers, useCreateCustomer } = useCustomersApi();
  const { useGetServices } = useServicesApi();
  const { useCreateOrder } = useOrdersApi();

  const createCustomerMutation = useCreateCustomer();
  const createOrderMutation = useCreateOrder();

  // Fetch customers reactive to url/nuqs search state
  const { fetcher: customersFetcher, handleSearch } = useGetCustomers({ limit: 5 });
  const matchingCustomers = customersFetcher.data?.data || [];
  const isCustomersLoading = customersFetcher.isLoading || customersFetcher.isFetching;

  // Fetch all services
  const { fetcher: servicesFetcher } = useGetServices({ limit: 100 });
  const services = servicesFetcher.data?.data || [];
  const isServicesLoading = servicesFetcher.isLoading;

  // Debounce customer search query
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(customerSearch);
    }, 400);
    return () => clearTimeout(timer);
  }, [customerSearch, handleSearch]);

  // --- Helper: Auto-Format Indonesian Phone ---
  const formatIndonesianPhone = (phone: string) => {
    let cleaned = phone.replace(/[^0-9]/g, ""); // remove non-digits
    if (cleaned.startsWith("0")) {
      cleaned = "+62" + cleaned.slice(1);
    } else if (cleaned.startsWith("62")) {
      cleaned = "+" + cleaned;
    } else if (cleaned.startsWith("8")) {
      cleaned = "+62" + cleaned;
    } else if (!cleaned.startsWith("+") && cleaned.length > 0) {
      cleaned = "+62" + cleaned;
    }
    return cleaned;
  };

  // --- Actions: Customer ---
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(customerSearch);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch("");
    handleSearch(""); // reset URL search
  };

  const handleAddCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerName || !newCustomerPhone || !newCustomerAddress) {
      toast({
        title: "Gagal menyimpan",
        description: "Semua field formulir wajib diisi.",
        variant: "destructive",
      });
      return;
    }

    const formattedPhone = formatIndonesianPhone(newCustomerPhone);
    const indonesianPhoneRegex = /^\+628\d{7,11}$/;
    if (!indonesianPhoneRegex.test(formattedPhone)) {
      toast({
        title: "Format nomor salah",
        description: "Nomor HP harus berformat Indonesia valid (contoh: 08123456789).",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingCustomer(true);
    try {
      const res = await createCustomerMutation.mutateAsync({
        fullName: newCustomerName,
        phone: formattedPhone,
        address: newCustomerAddress,
      });

      if (res.data) {
        toast({
          title: "Pelanggan Terdaftar",
          description: `Berhasil mendaftarkan ${res.data.fullName}.`,
          variant: "success",
        });
        setSelectedCustomer(res.data);
        // Reset form
        setNewCustomerName("");
        setNewCustomerPhone("");
        setNewCustomerAddress("");
        setShowAddCustomer(false);
      }
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Gagal mendaftarkan pelanggan",
        description: error.message || "Terjadi kesalahan pada sistem.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingCustomer(false);
    }
  };

  // --- Actions: Cart ---
  const handleAddToCart = (service: Service) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.serviceId === service.id);
      if (existing) {
        return prev.map((item) =>
          item.serviceId === service.id ? { ...item, qty: parseQty(item.qty) + 1 } : item
        );
      }
      return [
        ...prev,
        {
          serviceId: service.id,
          name: service.name,
          price: service.price,
          unit: service.unit,
          qty: 1,
        },
      ];
    });
  };

  const handleRemoveFromCart = (serviceId: string) => {
    setCart((prev) => prev.filter((item) => item.serviceId !== serviceId));
  };

  const handleUpdateQty = (serviceId: string, value: number | string) => {
    setCart((prev) =>
      prev.map((item) => (item.serviceId === serviceId ? { ...item, qty: value } : item))
    );
  };

  // --- Cart Calculations ---
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * parseQty(item.qty), 0);
  const cartItemCount = cart.filter((item) => parseQty(item.qty) > 0).reduce((sum, item) => sum + parseQty(item.qty), 0);

  const discountAmount =
    discountType === "PERCENTAGE"
      ? Math.round((cartSubtotal * discountValue) / 100)
      : discountValue;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  // --- Action: Checkout ---
  const handleCheckoutSubmit = async () => {
    if (!selectedCustomer) {
      toast({
        title: "Pelanggan Belum Dipilih",
        description: "Silakan pilih atau daftarkan pelanggan terlebih dahulu.",
        variant: "destructive",
      });
      return;
    }

    const zeroQtyItem = cart.find((item) => parseQty(item.qty) <= 0);
    if (zeroQtyItem) {
      toast({
        title: "Kuantitas Belum Diisi",
        description: `Kuantitas untuk layanan "${zeroQtyItem.name}" tidak boleh 0. Silakan isi kuantitas atau klik "Batal".`,
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingOrder(true);
    try {
      const itemsPayload = cart.map((item) => ({
        serviceId: item.serviceId,
        qty: parseQty(item.qty),
      }));

      await createOrderMutation.mutateAsync({
        customerId: selectedCustomer.id,
        items: itemsPayload,
        paymentStatus,
        manualDiscountType: discountValue > 0 ? discountType : undefined,
        manualDiscountValue: discountValue > 0 ? discountValue : undefined,
      });

      toast({
        title: "Pesanan Berhasil",
        description: "Pesanan baru telah berhasil ditambahkan ke sistem.",
        variant: "success",
      });

      // Reset POS
      setCart([]);
      setSelectedCustomer(null);
      setDiscountValue(0);
      setPaymentStatus("UNPAID");
      setShowCheckoutDialog(false);
      setActiveTab("orders"); // Switch to Orders/History tab
    } catch (err) {
      const error = err as Error;
      toast({
        title: "Gagal membuat pesanan",
        description: error.message || "Terjadi kesalahan saat menyimpan pesanan.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const handleOpenCheckout = () => {
    const zeroQtyItem = cart.find((item) => parseQty(item.qty) <= 0);
    if (zeroQtyItem) {
      toast({
        title: "Kuantitas Belum Diisi",
        description: `Kuantitas untuk layanan "${zeroQtyItem.name}" tidak boleh 0. Silakan isi kuantitas atau klik "Batal" jika ingin membatalkan.`,
        variant: "destructive",
      });
      return;
    }
    setShowCheckoutDialog(true);
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-28">
      {/* Tabs removed from top flow */}

      {/* VIEW: ORDERS (HISTORY) */}
      {activeTab === "orders" && <CashierOrders />}

      {/* VIEW: POS (NEW ORDER) */}
      {activeTab === "pos" && (
        <div className="space-y-5">
          {/* STEP 1: CUSTOMER SELECTION OR FORM */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-amber-500" />
              1. Pilih Pelanggan
            </h2>

            {selectedCustomer ? (
              // Selected Customer Card
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl flex justify-between items-center animate-fadeIn">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-amber-800">Pelanggan Aktif</p>
                  <p className="text-sm font-bold text-foreground truncate">
                    {selectedCustomer.fullName}
                  </p>
                  <p className="text-xs text-muted-foreground">{selectedCustomer.phone}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => setSelectedCustomer(null)}
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Ganti
                </Button>
              </div>
            ) : showAddCustomer ? (
              // Register New Customer Form
              <form onSubmit={handleAddCustomerSubmit} className="space-y-3.5 animate-fadeIn">
                <div className="flex justify-between items-center border-b pb-2">
                  <p className="text-xs font-bold text-foreground">Daftarkan Pelanggan Baru</p>
                  <button
                    type="button"
                    onClick={() => setShowAddCustomer(false)}
                    className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Kembali ke Cari
                  </button>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cust-name" className="text-xs font-semibold">
                    Nama Lengkap
                  </Label>
                  <Input
                    id="cust-name"
                    placeholder="Nama lengkap pelanggan..."
                    className="h-9 text-xs"
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cust-phone" className="text-xs font-semibold">
                    Nomor HP
                  </Label>
                  <Input
                    id="cust-phone"
                    placeholder="Contoh: 08123456789..."
                    className="h-9 text-xs"
                    type="tel"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground italic">
                    💡 Akan diformat otomatis ke standar Indonesia (+62)
                  </p>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="cust-address" className="text-xs font-semibold">
                    Alamat Lengkap
                  </Label>
                  <Textarea
                    id="cust-address"
                    placeholder="Alamat lengkap rumah..."
                    className="text-xs min-h-[60px]"
                    value={newCustomerAddress}
                    onChange={(e) => setNewCustomerAddress(e.target.value)}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-9 text-xs font-bold"
                  isLoading={isCreatingCustomer}
                >
                  Simpan & Pilih Pelanggan
                </Button>
              </form>
            ) : (
              // Search Customer Form
              <div className="space-y-3">
                <form onSubmit={handleSearchSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <Input
                      className="pl-9 h-9 text-xs"
                      placeholder="Cari No. HP atau Nama..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="sm" className="h-9 font-bold px-3 shrink-0">
                    Cari
                  </Button>
                </form>

                {/* Search Results */}
                {customerSearch && (
                  <div className="border rounded-xl divide-y bg-muted/20 overflow-hidden max-h-[160px] overflow-y-auto">
                    {isCustomersLoading ? (
                      <div className="p-3 text-center text-xs text-muted-foreground">
                        Mencari pelanggan...
                      </div>
                    ) : matchingCustomers.length === 0 ? (
                      <div className="p-3 text-center space-y-2">
                        <p className="text-xs text-muted-foreground">Pelanggan tidak ditemukan.</p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs font-bold flex items-center gap-1 mx-auto"
                          onClick={() => {
                            setNewCustomerPhone(customerSearch);
                            setShowAddCustomer(true);
                          }}
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                          Daftar Baru
                        </Button>
                      </div>
                    ) : (
                      matchingCustomers.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          className="w-full text-left p-2.5 hover:bg-amber-50/50 flex justify-between items-center transition-colors"
                          onClick={() => handleSelectCustomer(c)}
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-foreground truncate">
                              {c.fullName}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{c.phone}</p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-amber-500" />
                        </button>
                      ))
                    )}
                  </div>
                )}

                {/* Default Quick Actions */}
                {!customerSearch && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-9 text-xs font-bold flex items-center justify-center gap-1.5 border-dashed"
                    onClick={() => setShowAddCustomer(true)}
                  >
                    <UserPlus className="h-3.5 w-3.5 text-amber-500" />
                    Pelanggan Baru
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* STEP 2: SERVICES CATALOG (Enabled only when customer is selected) */}
          <div
            className={`bg-card border border-border rounded-2xl p-4 shadow-sm space-y-4 transition-all ${
              !selectedCustomer ? "opacity-60 pointer-events-none select-none" : ""
            }`}
          >
            <h2 className="text-sm font-bold text-foreground flex items-center gap-1.5 border-b pb-2">
              <ShoppingBag className="h-4 w-4 text-amber-500" />
              2. Pilih Layanan Laundry
            </h2>

            {isServicesLoading ? (
              // Services Skeletons
              <div className="space-y-2.5">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex justify-between items-center p-3 rounded-xl border">
                    <div className="space-y-1">
                      <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                      <div className="h-3.5 w-20 bg-muted animate-pulse rounded" />
                    </div>
                    <div className="h-8 w-16 bg-muted animate-pulse rounded" />
                  </div>
                ))}
              </div>
            ) : services.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">
                Tidak ada layanan laundry terdaftar.
              </p>
            ) : (
              // Service List Layout
              <div className="space-y-2.5">
                {services.map((service) => {
                  const cartItem = cart.find((c) => c.serviceId === service.id);
                  const isKg = service.unit === "KG";

                  return (
                    <div
                      key={service.id}
                      className={`flex justify-between items-center p-3 rounded-xl border transition-all duration-300 ${
                        cartItem
                          ? "border-amber-400 bg-amber-50/20 shadow-xs"
                          : "border-border hover:border-muted-foreground/30 bg-card"
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <h4 className="text-xs font-bold text-foreground truncate">
                          {service.name}
                        </h4>
                        <p className="text-[10px] text-muted-foreground">
                          Rp {service.price.toLocaleString("id-ID")} / {service.unit}
                        </p>
                      </div>

                      {/* Quantity Controller */}
                      <div className="shrink-0 flex items-center gap-2">
                        {cartItem ? (
                          <div className="flex items-center gap-1.5 animate-fadeIn">
                            <div className="flex items-center bg-muted rounded-xl border border-border px-2 py-1 h-9 shadow-inner focus-within:ring-2 focus-within:ring-amber-500/20 focus-within:border-amber-500 transition-all duration-200">
                              <input
                                type="number"
                                inputMode="decimal"
                                step={isKg ? "0.1" : "1"}
                                className="w-12 text-center bg-transparent border-none text-xs font-bold text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={cartItem.qty}
                                placeholder="0"
                                onChange={(e) => {
                                  handleUpdateQty(service.id, e.target.value);
                                }}
                              />
                              <span className="text-[10px] font-bold text-muted-foreground ml-1 bg-background/85 px-1.5 py-0.5 rounded border border-border/50 uppercase tracking-wider select-none">
                                {service.unit}
                              </span>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-9 text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2.5 rounded-xl transition-all duration-200"
                              onClick={() => handleRemoveFromCart(service.id)}
                            >
                              Batal
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="h-9 text-xs px-4 font-bold border-amber-300 text-amber-600 bg-amber-50/40 hover:bg-amber-100/50 rounded-xl transition-all active:scale-95 flex items-center gap-1"
                            onClick={() => handleAddToCart(service)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Tambah
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* FLOATING STICKY BOTTOM BAR (Stacked perfectly above bottom navbar at bottom-16) */}
      {activeTab === "pos" && cart.length > 0 && selectedCustomer && (
        <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] p-4 z-40 max-w-md mx-auto rounded-t-2xl animate-slideUp">
          <div className="flex justify-between items-center gap-4">
            <div>
              <p className="text-[10px] text-muted-foreground font-semibold">
                {cartItemCount} item • Pelanggan: {selectedCustomer.fullName.split(" ")[0]}
              </p>
              <p className="text-base font-bold text-foreground">
                Rp {cartSubtotal.toLocaleString("id-ID")}
              </p>
            </div>
            <Button
              className="h-10 text-xs font-bold px-6 shadow-md shadow-amber-500/20"
              onClick={handleOpenCheckout}
            >
              Bayar & Checkout
              <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
            </Button>
          </div>
        </div>
      )}

      {/* Native-like Bottom Navigation Bar (Melayang & Sticky di paling bawah) */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow-[0_-4px_16px_rgba(0,0,0,0.06)] px-8 py-2 z-50 max-w-md mx-auto flex items-center justify-around rounded-t-xl animate-fadeIn">
        <button
          onClick={() => setActiveTab("pos")}
          className={`flex flex-col items-center justify-center gap-1.5 py-1 px-4 text-[10px] font-extrabold transition-all cursor-pointer focus:outline-none ${
            activeTab === "pos"
              ? "text-amber-500 scale-105"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ShoppingBag className={`h-5 w-5 transition-transform duration-300 ${activeTab === "pos" ? "text-amber-500" : ""}`} />
          Order Baru
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex flex-col items-center justify-center gap-1.5 py-1 px-4 text-[10px] font-extrabold transition-all cursor-pointer focus:outline-none ${
            activeTab === "orders"
              ? "text-indigo-500 scale-105"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <ListFilter className={`h-5 w-5 transition-transform duration-300 ${activeTab === "orders" ? "text-indigo-500" : ""}`} />
          Riwayat Pesanan
        </button>
      </div>

      {/* CHECKOUT SUMMARY DIALOG */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <DialogContent className="max-w-xs p-5 rounded-2xl gap-4">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-foreground">Detail Pembayaran</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 text-xs">
            {/* Cart Summary */}
            <div className="space-y-2 border-b pb-3">
              <p className="font-bold text-muted-foreground tracking-wide text-[10px] uppercase">
                Ringkasan Layanan
              </p>
              {cart.filter((item) => parseQty(item.qty) > 0).map((item) => (
                <div key={item.serviceId} className="flex justify-between items-center text-foreground">
                  <span className="truncate pr-2 font-medium">{item.name}</span>
                  <span className="shrink-0 font-semibold text-muted-foreground">
                    {item.qty} {item.unit}
                  </span>
                </div>
              ))}
            </div>

            {/* Payment Status Option */}
            <div className="space-y-2">
              <p className="font-bold text-muted-foreground tracking-wide text-[10px] uppercase">
                Status Pembayaran
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentStatus("UNPAID")}
                  className={`flex-1 py-2 text-center font-bold rounded-xl border transition-all ${
                    paymentStatus === "UNPAID"
                      ? "border-red-400 bg-red-50 text-red-700 shadow-sm"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  Belum Lunas
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentStatus("PAID")}
                  className={`flex-1 py-2 text-center font-bold rounded-xl border transition-all ${
                    paymentStatus === "PAID"
                      ? "border-green-400 bg-green-50 text-green-700 shadow-sm"
                      : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  Lunas
                </button>
              </div>
            </div>

            {/* Manual Discount Segment */}
            <div className="space-y-2 border-t pt-3">
              <div className="flex justify-between items-center">
                <span className="font-bold text-muted-foreground tracking-wide text-[10px] uppercase flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Diskon Manual (Opsional)
                </span>
              </div>
              <div className="flex gap-1.5">
                <FlexibleSelect
                  value={discountType}
                  onValueChange={(val) => {
                    setDiscountType(val as "PERCENTAGE" | "FIXED");
                    setDiscountValue(0);
                  }}
                  options={[
                    { value: "PERCENTAGE", label: "Persen (%)" },
                    { value: "FIXED", label: "Rupiah (Rp)" },
                  ]}
                  size="sm"
                  className="w-[125px] bg-muted h-8 text-xs font-semibold"
                />
                <Input
                  type="number"
                  placeholder="Nilai diskon..."
                  className="h-8 text-xs flex-1"
                  value={discountValue || ""}
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            {/* Calculation Totals */}
            <div className="space-y-1.5 border-t pt-3 bg-muted/40 p-2.5 rounded-xl">
              <div className="flex justify-between items-center text-muted-foreground">
                <span>Subtotal</span>
                <span>Rp {cartSubtotal.toLocaleString("id-ID")}</span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between items-center text-red-500 font-medium">
                  <span>
                    Diskon {discountType === "PERCENTAGE" && `(${discountValue}%)`}
                  </span>
                  <span>- Rp {discountAmount.toLocaleString("id-ID")}</span>
                </div>
              )}
              <div className="h-px bg-border my-1" />
              <div className="flex justify-between items-center text-sm font-bold text-foreground">
                <span>Total Akhir</span>
                <span>Rp {cartTotal.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-2">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                className="flex-1 text-xs font-bold"
                onClick={() => setShowCheckoutDialog(false)}
                disabled={isSubmittingOrder}
              >
                Batal
              </Button>
              <Button
                className="flex-1 text-xs font-bold shadow-md shadow-amber-500/25"
                onClick={handleCheckoutSubmit}
                isLoading={isSubmittingOrder}
              >
                Buat Pesanan
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
