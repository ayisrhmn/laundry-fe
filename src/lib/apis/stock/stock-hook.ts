import { useMutation, useQuery } from "@tanstack/react-query";
import { stockAPi } from "..";
import { CreateStock } from "./stock-schema";

export function useStockApi() {
  const useGetStocks = () => {
    const fetcher = useQuery({
      queryKey: ["stocks"],
      queryFn: async () => {
        return await stockAPi.getStocks();
      },
      staleTime: 0,
    });
    return fetcher;
  };

  const useUpsertStock = () => {
    const mutation = useMutation({
      mutationKey: ["upsert-stock"],
      mutationFn: async (data: CreateStock & { id?: string }) => {
        return await stockAPi.upsertStock(data);
      },
    });
    return mutation;
  };

  return { useGetStocks, useUpsertStock };
}
