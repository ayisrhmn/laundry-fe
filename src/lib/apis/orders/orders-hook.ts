import {
  CreateOrderRequest,
  OrdersFilters,
  UpdateOrderRequest,
} from "@/@types/module/orders/request";
import usePagination from "@/hooks/use-pagination";
import { ordersApi } from "@/lib/apis";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";

export const ordersApiQueryKeys = {
  GET_ORDERS: "get-orders",
  GET_ARCHIVED_ORDERS: "get-archived-orders",
  GET_ORDER: "get-order",
  CREATE_ORDER: "create-order",
  UPDATE_ORDER: "update-order",
  DELETE_ORDER: "delete-order",
};

export function useOrdersApi() {
  const useGetOrders = (filters?: Partial<OrdersFilters>) => {
    const { limit, setLimit, page, setPage } = usePagination({
      id: ordersApiQueryKeys.GET_ORDERS,
      initialLimit: filters?.limit ?? 10,
      initialPage: filters?.page ?? 1,
    });

    const fetcher = useQuery({
      queryKey: [
        ordersApiQueryKeys.GET_ORDERS,
        {
          limit,
          page,
          search: filters?.search,
          sort: filters?.sort,
          customerId: filters?.customerId,
          orderStatus: filters?.orderStatus,
          paymentStatus: filters?.paymentStatus,
          dateFrom: filters?.dateFrom,
          dateTo: filters?.dateTo,
          discountType: filters?.discountType,
          hasDiscount: filters?.hasDiscount,
          minAmount: filters?.minAmount,
          maxAmount: filters?.maxAmount,
        },
      ],
      queryFn: async () => {
        return await ordersApi.getOrders({
          limit,
          page,
          search: filters?.search,
          sort: filters?.sort,
          customerId: filters?.customerId,
          orderStatus: filters?.orderStatus,
          paymentStatus: filters?.paymentStatus,
          dateFrom: filters?.dateFrom,
          dateTo: filters?.dateTo,
          discountType: filters?.discountType,
          hasDiscount: filters?.hasDiscount,
          minAmount: filters?.minAmount,
          maxAmount: filters?.maxAmount,
        });
      },
      staleTime: 0,
    });

    return {
      fetcher,
      limit,
      setLimit,
      page,
      setPage,
    };
  };

  const useGetArchivedOrders = (filters?: Partial<OrdersFilters>) => {
    const { limit, setLimit, page, setPage } = usePagination({
      id: ordersApiQueryKeys.GET_ARCHIVED_ORDERS,
      initialLimit: filters?.limit ?? 10,
      initialPage: filters?.page ?? 1,
    });

    const fetcher = useQuery({
      queryKey: [
        ordersApiQueryKeys.GET_ARCHIVED_ORDERS,
        {
          limit,
          page,
          search: filters?.search,
          sort: filters?.sort,
          customerId: filters?.customerId,
          orderStatus: filters?.orderStatus,
          paymentStatus: filters?.paymentStatus,
          dateFrom: filters?.dateFrom,
          dateTo: filters?.dateTo,
          discountType: filters?.discountType,
          hasDiscount: filters?.hasDiscount,
          minAmount: filters?.minAmount,
          maxAmount: filters?.maxAmount,
        },
      ],
      queryFn: async () => {
        return await ordersApi.getArchivedOrders({
          limit,
          page,
          search: filters?.search,
          sort: filters?.sort,
          customerId: filters?.customerId,
          orderStatus: filters?.orderStatus,
          paymentStatus: filters?.paymentStatus,
          dateFrom: filters?.dateFrom,
          dateTo: filters?.dateTo,
          discountType: filters?.discountType,
          hasDiscount: filters?.hasDiscount,
          minAmount: filters?.minAmount,
          maxAmount: filters?.maxAmount,
        });
      },
      staleTime: 0,
    });

    return {
      fetcher,
      limit,
      setLimit,
      page,
      setPage,
    };
  };

  const useGetOrder = (id: string) => {
    const fetcher = useQuery({
      queryKey: [ordersApiQueryKeys.GET_ORDER, id],
      queryFn: async () => {
        return await ordersApi.getOrder(id);
      },
      enabled: !!id,
    });
    return fetcher;
  };

  const useCreateOrder = () => {
    const mutation = useMutation({
      mutationKey: [ordersApiQueryKeys.CREATE_ORDER],
      mutationFn: async (data: CreateOrderRequest) => {
        return await ordersApi.createOrder(data);
      },
    });
    return mutation;
  };

  const useUpdateOrder = () => {
    const mutation = useMutation({
      mutationKey: [ordersApiQueryKeys.UPDATE_ORDER],
      mutationFn: async (data: UpdateOrderRequest & { id: string }) => {
        return await ordersApi.updateOrder(data);
      },
    });
    return mutation;
  };

  const useDeleteOrder = () => {
    const mutation = useMutation({
      mutationKey: [ordersApiQueryKeys.DELETE_ORDER],
      mutationFn: async (id: string) => {
        return await ordersApi.deleteOrder(id);
      },
    });
    return mutation;
  };

  const useGetInfiniteOrders = (filters?: Partial<OrdersFilters>) => {
    const limit = filters?.limit ?? 10;

    return useInfiniteQuery({
      queryKey: [
        ordersApiQueryKeys.GET_ORDERS,
        "infinite",
        {
          limit,
          search: filters?.search,
          sort: filters?.sort,
          customerId: filters?.customerId,
          orderStatus: filters?.orderStatus,
          paymentStatus: filters?.paymentStatus,
          dateFrom: filters?.dateFrom,
          dateTo: filters?.dateTo,
          discountType: filters?.discountType,
          hasDiscount: filters?.hasDiscount,
          minAmount: filters?.minAmount,
          maxAmount: filters?.maxAmount,
        },
      ],
      queryFn: async ({ pageParam }) => {
        return await ordersApi.getOrders({
          ...filters,
          limit,
          page: pageParam as number,
        });
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, totalPages } = lastPage.pagination;
        return page < totalPages ? page + 1 : undefined;
      },
      staleTime: 0,
    });
  };

  return {
    useGetOrders,
    useGetArchivedOrders,
    useGetInfiniteOrders,
    useGetOrder,
    useCreateOrder,
    useUpdateOrder,
    useDeleteOrder,
  };
}
