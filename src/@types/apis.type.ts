export type BaseApiOptions = {
  baseURL?: string;
};

export type PaginatedFilters = {
  limit?: number;
  page?: number;
  search?: string;
  sort?: string;
};

export type BaseApiResult<T> = {
  message: string;
  status: number;
  data: T;
};

export type BasePaginatedApiResult<T> = {
  message: string;
  status: number;
  data: T;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
