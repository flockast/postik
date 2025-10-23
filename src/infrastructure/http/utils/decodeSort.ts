import type { TypeSortBy } from '../../../application/commons/models'

type Sort<T extends string> = `${T}.${'asc' | 'desc'}` | T;

export const decodeSort = <T extends string>(sort: Sort<T>[]): TypeSortBy<Record<T, unknown>> =>
  sort.map((s) => {
    const [field, order] = s.split('.')
    return [field, order ?? 'asc' as const] as [keyof Record<T, unknown>, 'asc' | 'desc']
  })
