import usePagination from "@/hooks/use-pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { productTypeApi } from "..";
import { CreateProductType } from "./product-type-schema";

export function useProductTypeApi() {
  const useGetProductTypes = (initialLimit?: number) => {
    const { limit, setLimit, page, setPage, search, handleSearch } = usePagination({
      id: "product-types",
      initialLimit: initialLimit ?? 10,
      initialPage: 1,
    });
    const fetcher = useQuery({
      queryKey: ["product-types", { limit, page, search }],
      queryFn: async () => {
        return await productTypeApi.getProductTypes({
          limit,
          page,
          search,
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

  const useCreateProductType = () => {
    const mutation = useMutation({
      mutationKey: ["create-product-type"],
      mutationFn: async (data: CreateProductType) => {
        return await productTypeApi.createProductType(data);
      },
    });
    return mutation;
  };

  const useUpdateProductType = () => {
    const mutation = useMutation({
      mutationKey: ["update-product-type"],
      mutationFn: async (data: CreateProductType & { id: string }) => {
        return await productTypeApi.updateProductType(data);
      },
    });
    return mutation;
  };

  const useDeleteProductType = () => {
    const mutation = useMutation({
      mutationKey: ["delete-product-type"],
      mutationFn: async (id: string) => {
        return await productTypeApi.deleteProductType(id);
      },
    });
    return mutation;
  };

  return { useGetProductTypes, useCreateProductType, useUpdateProductType, useDeleteProductType };
}
