export type TypePagination = {
  offset: number
  limit: number
}

export type TypePaginatedResult<T> = {
  total: number
  data: T[]
}

export type TypeSortBy<T extends object> = Array<[keyof T, ('asc' | 'desc')?]>
