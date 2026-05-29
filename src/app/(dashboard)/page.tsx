"use client";

import { RevenueTrendRange } from "@/@types/module/dashboard/response";
import { AppHeading } from "@/components/base/app-heading";
import { useDashboardApi } from "@/lib/apis/dashboard/dashboard-hook";
import { useMemo, useState } from "react";
import { DashboardDiscountSummary } from "./_module/dashboard-discount-summary";
import { DashboardOrderBreakdown } from "./_module/dashboard-order-breakdown";
import { DashboardRecentOrders } from "./_module/dashboard-recent-orders";
import { DashboardRevenueChart } from "./_module/dashboard-revenue-chart";
import { DashboardSummaryCards } from "./_module/dashboard-summary-cards";
import { DashboardTopCustomers } from "./_module/dashboard-top-customers";
import { DashboardTopServices } from "./_module/dashboard-top-services";

export default function AppDashboardPage() {
  const [revenueTrendRange, setRevenueTrendRange] = useState<RevenueTrendRange>("30d");

  const {
    useGetSummary,
    useGetRevenueTrend,
    useGetOrderBreakdown,
    useGetTopServices,
    useGetTopCustomers,
    useGetRecentOrders,
    useGetDiscountSummary,
  } = useDashboardApi();

  const summaryQuery = useGetSummary();
  const revenueTrendQuery = useGetRevenueTrend({ range: revenueTrendRange });
  const orderBreakdownQuery = useGetOrderBreakdown();
  const topServicesQuery = useGetTopServices({ limit: 5 });
  const topCustomersQuery = useGetTopCustomers({ limit: 5 });
  const recentOrdersQuery = useGetRecentOrders({ limit: 10 });
  const discountSummaryQuery = useGetDiscountSummary();

  const revenueTrendData = useMemo(
    () => revenueTrendQuery.data?.data ?? [],
    [revenueTrendQuery.data],
  );
  const topServicesData = useMemo(() => topServicesQuery.data?.data ?? [], [topServicesQuery.data]);
  const topCustomersData = useMemo(
    () => topCustomersQuery.data?.data ?? [],
    [topCustomersQuery.data],
  );
  const recentOrdersData = useMemo(
    () => recentOrdersQuery.data?.data ?? [],
    [recentOrdersQuery.data],
  );

  return (
    <div className="space-y-6">
      <AppHeading title="Beranda" description="Pantau performa laundry Anda secara real-time." />

      {/* KPI Summary Cards */}
      <DashboardSummaryCards data={summaryQuery.data?.data} isLoading={summaryQuery.isLoading} />

      {/* Revenue Trend Chart */}
      <DashboardRevenueChart
        data={revenueTrendData}
        isLoading={revenueTrendQuery.isLoading}
        range={revenueTrendRange}
        onRangeChange={setRevenueTrendRange}
      />

      {/* Order Breakdown + Discount Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardOrderBreakdown
          data={orderBreakdownQuery.data?.data}
          isLoading={orderBreakdownQuery.isLoading}
        />
        <DashboardDiscountSummary
          data={discountSummaryQuery.data?.data}
          isLoading={discountSummaryQuery.isLoading}
        />
      </div>

      {/* Top Services + Top Customers */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardTopServices data={topServicesData} isLoading={topServicesQuery.isLoading} />
        <DashboardTopCustomers data={topCustomersData} isLoading={topCustomersQuery.isLoading} />
      </div>

      {/* Recent Orders */}
      <DashboardRecentOrders data={recentOrdersData} isLoading={recentOrdersQuery.isLoading} />
    </div>
  );
}
