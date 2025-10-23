import { snakeCase } from 'change-case'
import type { OrderByExpression } from 'kysely'
import type { DB } from 'kysely-codegen'
import type { TypeSortBy } from '../../application'

export function buildSortBy<
  Table extends Exclude<keyof DB, 'schemaversion'>,
  Model extends Record<string, unknown>,
  Alias extends string = Table,
  O extends object = {}
>(sortBy: TypeSortBy<Model>, alias?: Alias): ReadonlyArray<OrderByExpression<DB, Table, O>>{
  return sortBy.map(([field, order]) =>
    `${alias ? `${alias}.` : ''}${snakeCase(field as string)} ${order ?? 'asc'}`
  ) as unknown as ReadonlyArray<OrderByExpression<DB, Table, O>>
}
