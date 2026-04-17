import usePagination from "@/hooks/use-pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { productApi } from "..";
import { CreateProduct } from "./product-schema";

export function useProductApi() {
  const useGetProducts = (initialLimit?: number) => {
    const { limit, setLimit, page, setPage, search, handleSearch } = usePagination({
      id: "products",
      initialLimit: initialLimit ?? 10,
      initialPage: 1,
    });
    const fetcher = useQuery({
      queryKey: ["products", { limit, page, search }],
      queryFn: async () => {
        return await productApi.getProducts({
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

  const useCreateProduct = () => {
    const mutation = useMutation({
      mutationKey: ["create-product"],
      mutationFn: async (data: CreateProduct) => {
        return await productApi.createProduct(data);
      },
    });
    return mutation;
  };

  const useUpdateProduct = () => {
    const mutation = useMutation({
      mutationKey: ["update-product"],
      mutationFn: async (data: CreateProduct & { id: string }) => {
        return await productApi.updateProduct(data);
      },
    });
    return mutation;
  };

  const useDeleteProduct = () => {
    const mutation = useMutation({
      mutationKey: ["delete-product"],
      mutationFn: async (id: string) => {
        return await productApi.deleteProduct(id);
      },
    });
    return mutation;
  };

  return { useGetProducts, useCreateProduct, useUpdateProduct, useDeleteProduct };
}
