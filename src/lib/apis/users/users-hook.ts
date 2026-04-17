import { UserRequest } from "@/@types/module/users/request";
import usePagination from "@/hooks/use-pagination";
import { usersApi } from "@/lib/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UsersPaginateFilters } from "./users-api";

export const usersApiQueryKeys = {
  GET_USERS: "get-users",
  GET_USER: "get-user",
  UPDATE_USER: "update-user",
  DELETE_USER: "delete-user",
};

export function useUsersApi() {
  const useGetUsers = (filters?: Partial<UsersPaginateFilters>) => {
    const { limit, setLimit, page, setPage, search, handleSearch } = usePagination({
      id: usersApiQueryKeys.GET_USERS,
      initialLimit: filters?.limit ?? 10,
      initialPage: filters?.page ?? 1,
    });

    const fetcher = useQuery({
      queryKey: [
        usersApiQueryKeys.GET_USERS,
        { limit, page, search, role: filters?.role, sort: filters?.sort },
      ],
      queryFn: async () => {
        return await usersApi.getUsers({
          limit,
          page,
          search,
          role: filters?.role,
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

  const useGetUser = (id: string) => {
    const fetcher = useQuery({
      queryKey: [usersApiQueryKeys.GET_USER, id],
      queryFn: async () => {
        return await usersApi.getUser(id);
      },
      enabled: !!id,
    });
    return fetcher;
  };

  const useUpdateUser = () => {
    const mutation = useMutation({
      mutationKey: [usersApiQueryKeys.UPDATE_USER],
      mutationFn: async (data: UserRequest & { id: string }) => {
        return await usersApi.updateUser(data);
      },
    });
    return mutation;
  };

  const useDeleteUser = () => {
    const mutation = useMutation({
      mutationKey: [usersApiQueryKeys.DELETE_USER],
      mutationFn: async (id: string) => {
        return await usersApi.deleteUser(id);
      },
    });
    return mutation;
  };

  return { useGetUsers, useGetUser, useUpdateUser, useDeleteUser };
}
