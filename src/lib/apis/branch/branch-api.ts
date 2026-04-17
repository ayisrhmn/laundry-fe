import { BaseApi } from "@/lib/apis/base";
import { CreateBranch } from "./branch-schema";

export class BranchApi extends BaseApi {
  getBranches(params: PaginatedFilters) {
    return this.get<BasePaginatedApiResult<Branch[]>>({
      url: this.endpoints.branch,
      query: { ...this.getPaginatedQuery(params) } as Record<string, string>,
    });
  }

  createBranch(data: CreateBranch) {
    return this.post<BaseApiResult<Branch>>({
      url: this.endpoints.branch,
      data,
    });
  }

  updateBranch(data: CreateBranch & { id: string }) {
    return this.put<BaseApiResult<Branch>>({
      url: `${this.endpoints.branch}/${data?.id}`,
      data,
    });
  }

  deleteBranch(id: string) {
    return this.delete<BaseApiResult<void>>({
      url: `${this.endpoints.branch}/${id}`,
    });
  }
}
