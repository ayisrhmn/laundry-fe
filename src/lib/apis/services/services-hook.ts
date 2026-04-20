import { PaginatedFilters } from "@/@types/apis.type";
import { ServiceRequest } from "@/@types/module/services/request";
import usePagination from "@/hooks/use-pagination";
import { servicesApi } from "@/lib/apis";
import { useMutation, useQuery } from "@tanstack/react-query";

export const servicesApiQueryKeys = {
  GET_SERVICES: "get-services",
  GET_SERVICE: "get-service",
  CREATE_SERVICE: "create-service",
  UPDATE_SERVICE: "update-service",
  DELETE_SERVICE: "delete-service",
};

export function useServicesApi() {
  const useGetServices = (filters?: Partial<PaginatedFilters>) => {
    const { limit, setLimit, page, setPage, search, handleSearch } = usePagination({
      id: servicesApiQueryKeys.GET_SERVICES,
      initialLimit: filters?.limit ?? 10,
      initialPage: filters?.page ?? 1,
    });

    const fetcher = useQuery({
      queryKey: [servicesApiQueryKeys.GET_SERVICES, { limit, page, search, sort: filters?.sort }],
      queryFn: async () => {
        return await servicesApi.getServices({
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

  const useGetService = (id: string) => {
    const fetcher = useQuery({
      queryKey: [servicesApiQueryKeys.GET_SERVICE, id],
      queryFn: async () => {
        return await servicesApi.getService(id);
      },
      enabled: !!id,
    });
    return fetcher;
  };

  const useCreateService = () => {
    const mutation = useMutation({
      mutationKey: [servicesApiQueryKeys.CREATE_SERVICE],
      mutationFn: async (data: ServiceRequest) => {
        return await servicesApi.createService(data);
      },
    });
    return mutation;
  };

  const useUpdateService = () => {
    const mutation = useMutation({
      mutationKey: [servicesApiQueryKeys.UPDATE_SERVICE],
      mutationFn: async (data: ServiceRequest & { id: string }) => {
        return await servicesApi.updateService(data);
      },
    });
    return mutation;
  };

  const useDeleteService = () => {
    const mutation = useMutation({
      mutationKey: [servicesApiQueryKeys.DELETE_SERVICE],
      mutationFn: async (id: string) => {
        return await servicesApi.deleteService(id);
      },
    });
    return mutation;
  };

  return { useGetServices, useGetService, useCreateService, useUpdateService, useDeleteService };
}
