import { PaginatedFilters } from "@/@types/apis.type";
import { DiscountRuleRequest } from "@/@types/module/discount-rules/request";
import { DiscountType } from "@/@types/module/discount-rules/response";
import usePagination from "@/hooks/use-pagination";
import { discountRulesApi } from "@/lib/apis";
import { useMutation, useQuery } from "@tanstack/react-query";

export const discountRulesApiQueryKeys = {
  GET_DISCOUNT_RULES: "get-discount-rules",
  GET_DISCOUNT_RULE: "get-discount-rule",
  CREATE_DISCOUNT_RULE: "create-discount-rule",
  UPDATE_DISCOUNT_RULE: "update-discount-rule",
  DELETE_DISCOUNT_RULE: "delete-discount-rule",
};

export function useDiscountRulesApi() {
  const useGetDiscountRules = (filters?: Partial<PaginatedFilters & { discountType?: DiscountType }>) => {
    const { limit, setLimit, page, setPage, search, handleSearch } = usePagination({
      id: discountRulesApiQueryKeys.GET_DISCOUNT_RULES,
      initialLimit: filters?.limit ?? 10,
      initialPage: filters?.page ?? 1,
    });

    const fetcher = useQuery({
      queryKey: [
        discountRulesApiQueryKeys.GET_DISCOUNT_RULES,
        { limit, page, search, sort: filters?.sort, discountType: filters?.discountType },
      ],
      queryFn: async () => {
        return await discountRulesApi.getDiscountRules({
          limit,
          page,
          search,
          sort: filters?.sort,
          discountType: filters?.discountType,
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

  const useGetDiscountRule = (id: string) => {
    const fetcher = useQuery({
      queryKey: [discountRulesApiQueryKeys.GET_DISCOUNT_RULE, id],
      queryFn: async () => {
        return await discountRulesApi.getDiscountRule(id);
      },
      enabled: !!id,
    });
    return fetcher;
  };

  const useCreateDiscountRule = () => {
    const mutation = useMutation({
      mutationKey: [discountRulesApiQueryKeys.CREATE_DISCOUNT_RULE],
      mutationFn: async (data: DiscountRuleRequest) => {
        return await discountRulesApi.createDiscountRule(data);
      },
    });
    return mutation;
  };

  const useUpdateDiscountRule = () => {
    const mutation = useMutation({
      mutationKey: [discountRulesApiQueryKeys.UPDATE_DISCOUNT_RULE],
      mutationFn: async (data: DiscountRuleRequest & { id: string }) => {
        return await discountRulesApi.updateDiscountRule(data);
      },
    });
    return mutation;
  };

  const useDeleteDiscountRule = () => {
    const mutation = useMutation({
      mutationKey: [discountRulesApiQueryKeys.DELETE_DISCOUNT_RULE],
      mutationFn: async (id: string) => {
        return await discountRulesApi.deleteDiscountRule(id);
      },
    });
    return mutation;
  };

  return {
    useGetDiscountRules,
    useGetDiscountRule,
    useCreateDiscountRule,
    useUpdateDiscountRule,
    useDeleteDiscountRule,
  };
}
