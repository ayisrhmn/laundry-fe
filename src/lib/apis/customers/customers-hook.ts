import { PaginatedFilters } from "@/@types/apis.type";
import { CustomerRequest } from "@/@types/module/customers/request";
import usePagination from "@/hooks/use-pagination";
import { customersApi } from "@/lib/apis";
import { useMutation, useQuery } from "@tanstack/react-query";

export const customersApiQueryKeys = {
  GET_CUSTOMERS: "get-customers",
  GET_CUSTOMER: "get-customer",
  CREATE_CUSTOMER: "create-customer",
  UPDATE_CUSTOMER: "update-customer",
  DELETE_CUSTOMER: "delete-customer",
};

export function useCustomersApi() {
  const useGetCustomers = (filters?: Partial<PaginatedFilters>) => {
    const { limit, setLimit, page, setPage, search, handleSearch } = usePagination({
      id: customersApiQueryKeys.GET_CUSTOMERS,
      initialLimit: filters?.limit ?? 10,
      initialPage: filters?.page ?? 1,
    });

    const fetcher = useQuery({
      queryKey: [customersApiQueryKeys.GET_CUSTOMERS, { limit, page, search, sort: filters?.sort }],
      queryFn: async () => {
        return await customersApi.getCustomers({
          limit,
          page,
          search,
          sort: filters?.sort,
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
      search,
      handleSearch,
    };
  };

  const useGetCustomer = (id: string) => {
    const fetcher = useQuery({
      queryKey: [customersApiQueryKeys.GET_CUSTOMER, id],
      queryFn: async () => {
        return await customersApi.getCustomer(id);
      },
      enabled: !!id,
    });
    return fetcher;
  };

  const useCreateCustomer = () => {
    const mutation = useMutation({
      mutationKey: [customersApiQueryKeys.CREATE_CUSTOMER],
      mutationFn: async (data: CustomerRequest) => {
        return await customersApi.createCustomer(data);
      },
    });
    return mutation;
  };

  const useUpdateCustomer = () => {
    const mutation = useMutation({
      mutationKey: [customersApiQueryKeys.UPDATE_CUSTOMER],
      mutationFn: async (data: CustomerRequest & { id: string }) => {
        return await customersApi.updateCustomer(data);
      },
    });
    return mutation;
  };

  const useDeleteCustomer = () => {
    const mutation = useMutation({
      mutationKey: [customersApiQueryKeys.DELETE_CUSTOMER],
      mutationFn: async (id: string) => {
        return await customersApi.deleteCustomer(id);
      },
    });
    return mutation;
  };

  return {
    useGetCustomers,
    useGetCustomer,
    useCreateCustomer,
    useUpdateCustomer,
    useDeleteCustomer,
  };
}
