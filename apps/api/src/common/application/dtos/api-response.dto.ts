import { PaginationMeta } from '@beep/shared';

export class ApiResponseDto<T> {
  data: T;
  meta?: PaginationMeta;

  constructor(data: T, meta?: PaginationMeta) {
    this.data = data;
    this.meta = meta;
  }

  static ok<T>(data: T): ApiResponseDto<T> {
    return new ApiResponseDto(data);
  }

  static paginated<T>(data: T, meta: PaginationMeta): ApiResponseDto<T> {
    return new ApiResponseDto(data, meta);
  }
}
