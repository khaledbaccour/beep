export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  errors?: ApiError[];
}

export interface ApiListResponse<T> {
  data: T[];
  meta: PaginationMeta;
  errors?: ApiError[];
}
