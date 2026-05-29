export type DashboardSummary = {
  revenueTodayTotal: number;
  revenueMonthTotal: number;
  orderTodayCount: number;
  orderPendingCount: number;
  orderUnpaidCount: number;
  orderUnpaidTotal: number;
  totalActiveCustomers: number;
};

export type RevenueTrendRange = "today" | "7d" | "30d" | "this_month";

export type RevenueTrendItem = {
  date: string;
  revenue: number;
};

export type OrderBreakdown = {
  orderStatus: {
    pending: number;
    done: number;
  };
  paymentStatus: {
    unpaid: number;
    paid: number;
  };
};

export type TopServiceItem = {
  serviceId: string;
  serviceName: string;
  unit: "KG" | "ITEM";
  orderCount: number;
  totalRevenue: number;
};

export type TopCustomerItem = {
  customerId: string;
  customerName: string;
  phone: string;
  transactionCount: number;
  totalSpending: number;
};

export type RecentOrderItem = {
  id: string;
  orderNumber: string;
  customerName: string;
  totalPrice: number;
  orderStatus: "PENDING" | "DONE";
  paymentStatus: "UNPAID" | "PAID";
  createdAt: string;
};

export type DiscountSummary = {
  totalDiscountAmount: number;
  totalOrdersWithDiscount: number;
  autoDiscountCount: number;
  manualDiscountCount: number;
  autoDiscountAmount: number;
  manualDiscountAmount: number;
};
