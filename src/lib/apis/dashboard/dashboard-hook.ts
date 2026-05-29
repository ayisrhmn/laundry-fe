import {
  RecentOrdersParams,
  RevenueTrendParams,
  TopCustomersParams,
  TopServicesParams,
} from "@/@types/module/dashboard/request";
import { dashboardApi } from "@/lib/apis";
import { useQuery } from "@tanstack/react-query";

export const dashboardApiQueryKeys = {
  GET_SUMMARY: "get-dashboard-summary",
  GET_REVENUE_TREND: "get-dashboard-revenue-trend",
  GET_ORDER_BREAKDOWN: "get-dashboard-order-breakdown",
  GET_TOP_SERVICES: "get-dashboard-top-services",
  GET_TOP_CUSTOMERS: "get-dashboard-top-customers",
  GET_RECENT_ORDERS: "get-dashboard-recent-orders",
  GET_DISCOUNT_SUMMARY: "get-dashboard-discount-summary",
};

export function useDashboardApi() {
  const useGetSummary = () => {
    return useQuery({
      queryKey: [dashboardApiQueryKeys.GET_SUMMARY],
      queryFn: async () => {
        return await dashboardApi.getSummary();
      },
      staleTime: 0,
    });
  };

  const useGetRevenueTrend = (params?: RevenueTrendParams) => {
    return useQuery({
      queryKey: [dashboardApiQueryKeys.GET_REVENUE_TREND, { range: params?.range }],
      queryFn: async () => {
        return await dashboardApi.getRevenueTrend(params);
      },
      staleTime: 0,
    });
  };

  const useGetOrderBreakdown = () => {
    return useQuery({
      queryKey: [dashboardApiQueryKeys.GET_ORDER_BREAKDOWN],
      queryFn: async () => {
        return await dashboardApi.getOrderBreakdown();
      },
      staleTime: 0,
    });
  };

  const useGetTopServices = (params?: TopServicesParams) => {
    return useQuery({
      queryKey: [dashboardApiQueryKeys.GET_TOP_SERVICES, { limit: params?.limit }],
      queryFn: async () => {
        return await dashboardApi.getTopServices(params);
      },
      staleTime: 0,
    });
  };

  const useGetTopCustomers = (params?: TopCustomersParams) => {
    return useQuery({
      queryKey: [dashboardApiQueryKeys.GET_TOP_CUSTOMERS, { limit: params?.limit }],
      queryFn: async () => {
        return await dashboardApi.getTopCustomers(params);
      },
      staleTime: 0,
    });
  };

  const useGetRecentOrders = (params?: RecentOrdersParams) => {
    return useQuery({
      queryKey: [dashboardApiQueryKeys.GET_RECENT_ORDERS, { limit: params?.limit }],
      queryFn: async () => {
        return await dashboardApi.getRecentOrders(params);
      },
      staleTime: 0,
    });
  };

  const useGetDiscountSummary = () => {
    return useQuery({
      queryKey: [dashboardApiQueryKeys.GET_DISCOUNT_SUMMARY],
      queryFn: async () => {
        return await dashboardApi.getDiscountSummary();
      },
      staleTime: 0,
    });
  };

  return {
    useGetSummary,
    useGetRevenueTrend,
    useGetOrderBreakdown,
    useGetTopServices,
    useGetTopCustomers,
    useGetRecentOrders,
    useGetDiscountSummary,
  };
}
