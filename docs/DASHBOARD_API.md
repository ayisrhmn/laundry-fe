# Dashboard API

Base URL: `/dashboard`

Semua endpoint memerlukan autentikasi JWT (`Authorization: Bearer <token>`) dan hanya dapat diakses oleh user dengan role **ADMIN**.

---

## Daftar Endpoint

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/dashboard/summary` | KPI summary cards |
| GET | `/dashboard/revenue-trend` | Tren pendapatan harian |
| GET | `/dashboard/order-breakdown` | Breakdown status order & pembayaran |
| GET | `/dashboard/top-services` | Layanan terlaris |
| GET | `/dashboard/top-customers` | Pelanggan dengan spending tertinggi |
| GET | `/dashboard/recent-orders` | Order terbaru |
| GET | `/dashboard/discount-summary` | Ringkasan diskon bulan ini |

---

## Format Umum Response

Semua endpoint mengembalikan response dengan struktur berikut:

```json
{
  "message": "string",
  "status": 200,
  "data": { ... }
}
```

Untuk endpoint yang mengembalikan array, `data` berupa array:

```json
{
  "message": "string",
  "status": 200,
  "data": [ ... ]
}
```

---

## 1. GET `/dashboard/summary`

Mengambil KPI utama untuk halaman beranda dashboard.

### Query Params

Tidak ada.

### Response

```json
{
  "message": "Dashboard summary retrieved successfully",
  "status": 200,
  "data": {
    "revenueTodayTotal": 450000,
    "revenueMonthTotal": 9800000,
    "orderTodayCount": 7,
    "orderPendingCount": 12,
    "orderUnpaidCount": 5,
    "orderUnpaidTotal": 750000,
    "totalActiveCustomers": 84
  }
}
```

### Keterangan Field `data`

| Field | Type | Deskripsi |
|-------|------|-----------|
| `revenueTodayTotal` | `number` | Total pendapatan dari order PAID hari ini |
| `revenueMonthTotal` | `number` | Total pendapatan dari order PAID bulan berjalan |
| `orderTodayCount` | `number` | Jumlah order dibuat hari ini (semua status) |
| `orderPendingCount` | `number` | Jumlah order dengan status `PENDING` |
| `orderUnpaidCount` | `number` | Jumlah order dengan payment status `UNPAID` |
| `orderUnpaidTotal` | `number` | Total nominal order yang belum dibayar |
| `totalActiveCustomers` | `number` | Jumlah customer dengan minimal 1 transaksi |

---

## 2. GET `/dashboard/revenue-trend`

Mengambil data tren pendapatan harian dalam rentang waktu tertentu.

### Query Params

| Param | Type | Required | Default | Deskripsi |
|-------|------|----------|---------|-----------|
| `range` | `enum` | Tidak | `30d` | Rentang waktu: `today` \| `7d` \| `30d` \| `this_month` |

### Contoh Request

```
GET /dashboard/revenue-trend?range=7d
```

### Response

```json
{
  "message": "Revenue trend retrieved successfully",
  "status": 200,
  "data": [
    { "date": "2026-05-23", "revenue": 280000 },
    { "date": "2026-05-24", "revenue": 415000 },
    { "date": "2026-05-25", "revenue": 0 },
    { "date": "2026-05-26", "revenue": 560000 },
    { "date": "2026-05-27", "revenue": 320000 },
    { "date": "2026-05-28", "revenue": 490000 },
    { "date": "2026-05-29", "revenue": 450000 }
  ]
}
```

> **Catatan:** Tanggal tanpa order tidak akan muncul di array. Frontend perlu mengisi gap tersebut dengan nilai `0`.

### Keterangan Field item `data[]`

| Field | Type | Deskripsi |
|-------|------|-----------|
| `date` | `string` (YYYY-MM-DD) | Tanggal |
| `revenue` | `number` | Total pendapatan PAID pada tanggal tersebut |

---

## 3. GET `/dashboard/order-breakdown`

Mengambil breakdown jumlah order berdasarkan status order dan status pembayaran.

### Query Params

Tidak ada.

### Response

```json
{
  "message": "Order breakdown retrieved successfully",
  "status": 200,
  "data": {
    "orderStatus": {
      "pending": 12,
      "done": 88
    },
    "paymentStatus": {
      "unpaid": 5,
      "paid": 95
    }
  }
}
```

### Keterangan Field `data`

| Field | Type | Deskripsi |
|-------|------|-----------|
| `orderStatus.pending` | `number` | Jumlah order dengan status `PENDING` |
| `orderStatus.done` | `number` | Jumlah order dengan status `DONE` |
| `paymentStatus.unpaid` | `number` | Jumlah order dengan payment `UNPAID` |
| `paymentStatus.paid` | `number` | Jumlah order dengan payment `PAID` |

---

## 4. GET `/dashboard/top-services`

Mengambil daftar layanan terlaris berdasarkan jumlah order item.

### Query Params

| Param | Type | Required | Default | Deskripsi |
|-------|------|----------|---------|-----------|
| `limit` | `number` | Tidak | `5` | Jumlah item yang dikembalikan (min: 1, max: 20) |

### Contoh Request

```
GET /dashboard/top-services?limit=5
```

### Response

```json
{
  "message": "Top services retrieved successfully",
  "status": 200,
  "data": [
    {
      "serviceId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "serviceName": "Cuci Kering",
      "unit": "KG",
      "orderCount": 42,
      "totalRevenue": 1680000
    },
    {
      "serviceId": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "serviceName": "Setrika",
      "unit": "KG",
      "orderCount": 30,
      "totalRevenue": 900000
    }
  ]
}
```

### Keterangan Field item `data[]`

| Field | Type | Deskripsi |
|-------|------|-----------|
| `serviceId` | `string` (UUID) | ID layanan |
| `serviceName` | `string` | Nama layanan |
| `unit` | `enum` (`KG` \| `ITEM`) | Satuan layanan |
| `orderCount` | `number` | Jumlah order item untuk layanan ini |
| `totalRevenue` | `number` | Total pendapatan dari layanan ini |

---

## 5. GET `/dashboard/top-customers`

Mengambil daftar pelanggan dengan total spending tertinggi dari order PAID.

### Query Params

| Param | Type | Required | Default | Deskripsi |
|-------|------|----------|---------|-----------|
| `limit` | `number` | Tidak | `5` | Jumlah item yang dikembalikan (min: 1, max: 20) |

### Contoh Request

```
GET /dashboard/top-customers?limit=5
```

### Response

```json
{
  "message": "Top customers retrieved successfully",
  "status": 200,
  "data": [
    {
      "customerId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "customerName": "Budi Santoso",
      "phone": "081234567890",
      "transactionCount": 15,
      "totalSpending": 2450000
    },
    {
      "customerId": "c3d4e5f6-a7b8-9012-cdef-123456789012",
      "customerName": "Siti Rahayu",
      "phone": "082345678901",
      "transactionCount": 10,
      "totalSpending": 1800000
    }
  ]
}
```

### Keterangan Field item `data[]`

| Field | Type | Deskripsi |
|-------|------|-----------|
| `customerId` | `string` (UUID) | ID pelanggan |
| `customerName` | `string` | Nama lengkap pelanggan |
| `phone` | `string` | Nomor telepon pelanggan |
| `transactionCount` | `number` | Jumlah total transaksi PAID |
| `totalSpending` | `number` | Total belanja dari order PAID |

---

## 6. GET `/dashboard/recent-orders`

Mengambil daftar order terbaru berdasarkan waktu dibuat.

### Query Params

| Param | Type | Required | Default | Deskripsi |
|-------|------|----------|---------|-----------|
| `limit` | `number` | Tidak | `10` | Jumlah order yang dikembalikan (min: 1, max: 50) |

### Contoh Request

```
GET /dashboard/recent-orders?limit=10
```

### Response

```json
{
  "message": "Recent orders retrieved successfully",
  "status": 200,
  "data": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "orderNumber": "ORD-20260529-007",
      "customerName": "Budi Santoso",
      "totalPrice": 75000,
      "orderStatus": "PENDING",
      "paymentStatus": "UNPAID",
      "createdAt": "2026-05-29T08:00:00.000Z"
    },
    {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "orderNumber": "ORD-20260529-006",
      "customerName": "Siti Rahayu",
      "totalPrice": 120000,
      "orderStatus": "DONE",
      "paymentStatus": "PAID",
      "createdAt": "2026-05-29T07:45:00.000Z"
    }
  ]
}
```

### Keterangan Field item `data[]`

| Field | Type | Deskripsi |
|-------|------|-----------|
| `id` | `string` (UUID) | ID order |
| `orderNumber` | `string` | Nomor order (format: `ORD-YYYYMMDD-NNN`) |
| `customerName` | `string` | Nama pelanggan |
| `totalPrice` | `number` | Total harga setelah diskon |
| `orderStatus` | `enum` (`PENDING` \| `DONE`) | Status pengerjaan order |
| `paymentStatus` | `enum` (`UNPAID` \| `PAID`) | Status pembayaran order |
| `createdAt` | `string` (ISO 8601) | Waktu order dibuat |

---

## 7. GET `/dashboard/discount-summary`

Mengambil ringkasan diskon yang diberikan pada bulan berjalan.

### Query Params

Tidak ada.

### Response

```json
{
  "message": "Discount summary retrieved successfully",
  "status": 200,
  "data": {
    "totalDiscountAmount": 185000,
    "totalOrdersWithDiscount": 18,
    "autoDiscountCount": 14,
    "manualDiscountCount": 4,
    "autoDiscountAmount": 140000,
    "manualDiscountAmount": 45000
  }
}
```

### Keterangan Field `data`

| Field | Type | Deskripsi |
|-------|------|-----------|
| `totalDiscountAmount` | `number` | Total nominal diskon yang diberikan bulan ini |
| `totalOrdersWithDiscount` | `number` | Jumlah order yang mendapat diskon bulan ini |
| `autoDiscountCount` | `number` | Jumlah order dengan diskon otomatis (`AUTO`) |
| `manualDiscountCount` | `number` | Jumlah order dengan diskon manual (`MANUAL`) |
| `autoDiscountAmount` | `number` | Total nominal diskon `AUTO` |
| `manualDiscountAmount` | `number` | Total nominal diskon `MANUAL` |

---

## Error Responses

### 401 Unauthorized

Token tidak valid atau tidak disertakan.

```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

### 403 Forbidden

User tidak memiliki role `ADMIN`.

```json
{
  "message": "Forbidden resource",
  "statusCode": 403
}
```

### 429 Too Many Requests

Rate limit terlampaui (60 request per menit).

```json
{
  "message": "ThrottlerException: Too Many Requests",
  "statusCode": 429
}
```
