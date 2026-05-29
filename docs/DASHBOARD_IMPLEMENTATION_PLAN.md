# Dashboard Page — Implementation Plan

Rencana refactor `src/app/(dashboard)/page.tsx` dari data dummy ke API riil menggunakan hooks yang sudah dibuat.

---

## Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  AppHeading                                                     │
├──────────┬──────────┬──────────┬──────────┬──────────┬─────────┤
│  KPI 1   │  KPI 2   │  KPI 3   │  KPI 4   │  KPI 5   │  KPI 6  │  ← Cards (summary)
├──────────┴──────────┴──────────┴──────────┴──────────┴─────────┤
│  Revenue Trend Chart (LineChart, full width)                    │  ← Chart
├───────────────────────────────────┬─────────────────────────────┤
│  Order Breakdown (Pie/Donut x2)   │  Discount Summary (Cards)   │  ← Chart + Cards
├───────────────────────────────────┴─────────────────────────────┤
│  Top Services (Bar Chart)          Top Customers (DataTable)    │  ← Chart + Table
├─────────────────────────────────────────────────────────────────┤
│  Recent Orders (DataTable, full width)                          │  ← Table
└─────────────────────────────────────────────────────────────────┘
```

---

## Keputusan Visualisasi per Endpoint

| Endpoint | Visualisasi | Alasan |
|---|---|---|
| `/dashboard/summary` | **6 KPI Cards** | Data angka tunggal, paling efektif ditampilkan sebagai metric card |
| `/dashboard/revenue-trend` | **Line Chart** (recharts) | Data time-series harian → chart paling natural untuk tren |
| `/dashboard/order-breakdown` | **2 Donut/Pie Chart** berdampingan | Proporsi 2 kategori (order status & payment status) → pie ideal |
| `/dashboard/top-services` | **Bar Chart** horizontal (recharts) | Perbandingan antar layanan → bar chart lebih mudah dibaca |
| `/dashboard/top-customers` | **DataTable** (`app-datatable`) | Data tabular dengan banyak kolom (nama, telepon, transaksi, spending) |
| `/dashboard/recent-orders` | **DataTable** (`app-datatable`) | Daftar order terbaru dengan status badge → sudah ada pola di codebase |
| `/dashboard/discount-summary` | **2×3 Metric Cards** dalam 1 Card | 6 angka ringkasan, tidak ada dimensi waktu → card lebih ringkas dari chart |

---

## Section Detail

### 1. KPI Summary Cards — `useGetSummary()`

6 card dalam grid `grid-cols-2 lg:grid-cols-3 xl:grid-cols-6`:

| Card | Field | Icon |
|---|---|---|
| Pendapatan Hari Ini | `revenueTodayTotal` | `DollarSign` |
| Pendapatan Bulan Ini | `revenueMonthTotal` | `TrendingUp` |
| Order Hari Ini | `orderTodayCount` | `ShoppingCart` |
| Order Pending | `orderPendingCount` | `Clock` |
| Belum Dibayar (count) | `orderUnpaidCount` | `AlertCircle` |
| Total Belum Dibayar (Rp) | `orderUnpaidTotal` | `Wallet` |

> `totalActiveCustomers` akan ditampilkan di section Discount Summary sebagai konteks tambahan.

Nilai uang menggunakan `formatMoney()` dari `@/lib/utils/money`.

---

### 2. Revenue Trend — `useGetRevenueTrend({ range })`

- **Komponen:** `LineChart` dari recharts (sudah diinstall di project)
- **Range selector:** `SegmentedControl` / `Button` group untuk pilih `today | 7d | 30d | this_month` (default: `30d`)
- **Gap handling:** tanggal tanpa data perlu di-fill dengan `revenue: 0` di sisi frontend (sesuai catatan di docs API)
- **X-Axis:** format tanggal pendek (`dd MMM`)
- **Y-Axis:** format `Rp` singkat (e.g., `500rb`, `1jt`)
- **Tooltip:** tampilkan tanggal lengkap + `formatMoney(revenue)`

---

### 3. Order Breakdown — `useGetOrderBreakdown()`

- **Komponen:** 2 `PieChart` (recharts) dengan `innerRadius` (donut style) berdampingan dalam `grid-cols-2`
  - **Kiri:** Order Status — `pending` vs `done`
  - **Kanan:** Payment Status — `unpaid` vs `paid`
- Warna:
  - Pending / Unpaid → `#f59e0b` (amber)
  - Done / Paid → `#22c55e` (green)
- Setiap donut dilengkapi label persentase di tengah

---

### 4. Top Services — `useGetTopServices({ limit: 5 })`

- **Komponen:** `BarChart` horizontal (recharts)
- X-Axis: `totalRevenue` (format `formatMoney`)
- Y-Axis: `serviceName`
- Bar warna primer, tooltip tampilkan `orderCount` dan `totalRevenue`

---

### 5. Top Customers — `useGetTopCustomers({ limit: 5 })`

- **Komponen:** `DataTable` (`app-datatable`, `usePagination={false}`)
- Kolom: Nama, No. Telp, Jumlah Transaksi, Total Spending (`formatMoney`)
- `headerChildren`: judul "Pelanggan Terbaik"

---

### 6. Recent Orders — `useGetRecentOrders({ limit: 10 })`

- **Komponen:** `DataTable` (`app-datatable`, `usePagination={false}`)
- Kolom: No. Order, Pelanggan, Total (`formatMoney`), Status Order (badge), Status Bayar (badge), Waktu (`formatDate`)
- Badge color: sama dengan pola di halaman orders yang sudah ada

---

### 7. Discount Summary — `useGetDiscountSummary()`

- **Komponen:** 1 `Card` wrapper berisi grid `grid-cols-2 md:grid-cols-3` dari 6 metric kecil:

| Metric | Field |
|---|---|
| Total Diskon | `totalDiscountAmount` |
| Order Dapat Diskon | `totalOrdersWithDiscount` |
| Diskon Auto (count) | `autoDiscountCount` |
| Diskon Auto (Rp) | `autoDiscountAmount` |
| Diskon Manual (count) | `manualDiscountCount` |
| Diskon Manual (Rp) | `manualDiscountAmount` |

---

## Skeleton Loading

Setiap section memiliki skeleton sendiri menggunakan komponen `Skeleton` dari `@/components/ui/skeleton`:
- Cards → `Skeleton` dengan ukuran card
- Chart → `Skeleton` persegi panjang setinggi chart
- DataTable → sudah ada prop `loading` di `DataTable`

---

## File yang Akan Diubah / Dibuat

| File | Aksi | Keterangan |
|---|---|---|
| `src/app/(dashboard)/page.tsx` | **Edit** | Hapus data dummy, gunakan hooks dashboard |
| `src/app/(dashboard)/_module/` | **Buat folder baru** | Komponen per-section yang di-extract agar `page.tsx` tetap ringkas |
| `_module/dashboard-summary-cards.tsx` | **Buat** | Section KPI cards |
| `_module/dashboard-revenue-chart.tsx` | **Buat** | Line chart tren pendapatan + range selector |
| `_module/dashboard-order-breakdown.tsx` | **Buat** | Donut chart order & payment status |
| `_module/dashboard-top-services.tsx` | **Buat** | Bar chart top services |
| `_module/dashboard-top-customers.tsx` | **Buat** | DataTable top customers |
| `_module/dashboard-recent-orders.tsx` | **Buat** | DataTable recent orders |
| `_module/dashboard-discount-summary.tsx` | **Buat** | Metric cards diskon |

---

## Dependensi

- `recharts` — sudah terinstall (dipakai di `page.tsx` saat ini)
- `@tanstack/react-query` — sudah terinstall
- `formatMoney` dari `@/lib/utils/money` — sudah ada
- `formatDate` dari `@/lib/utils/time` — sudah ada
- `DataTable` dari `@/components/base/app-datatable` — sudah ada
- `Skeleton` dari `@/components/ui/skeleton` — sudah ada

Tidak ada dependensi baru yang perlu diinstall.
