import usePagination from "@/hooks/use-pagination";
import { useMutation, useQuery } from "@tanstack/react-query";
import { branchApi } from "..";
import { CreateBranch } from "./branch-schema";

export function useBranchApi() {
  const useGetBranches = (initialLimit?: number) => {
    const { limit, setLimit, page, setPage, search, handleSearch } = usePagination({
      id: "branches",
      initialLimit: initialLimit ?? 10,
      initialPage: 1,
    });
    const fetcher = useQuery({
      queryKey: ["branches", { limit, page, search }],
      queryFn: async () => {
        return await branchApi.getBranches({
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

  const useCreateBranch = () => {
    const mutation = useMutation({
      mutationKey: ["create-branch"],
      mutationFn: async (data: CreateBranch) => {
        return await branchApi.createBranch(data);
      },
    });
    return mutation;
  };

  const useUpdateBranch = () => {
    const mutation = useMutation({
      mutationKey: ["update-branch"],
      mutationFn: async (data: CreateBranch & { id: string }) => {
        return await branchApi.updateBranch(data);
      },
    });
    return mutation;
  };

  const useDeleteBranch = () => {
    const mutation = useMutation({
      mutationKey: ["delete-branch"],
      mutationFn: async (id: string) => {
        return await branchApi.deleteBranch(id);
      },
    });
    return mutation;
  };

  return { useGetBranches, useCreateBranch, useUpdateBranch, useDeleteBranch };
}
