import { type TSchema, Type } from '@sinclair/typebox'

export const PaginationResult = <Schema extends TSchema>(itemsSchema: TSchema) => {
  return Type.Object({
    total: Type.Number({ default: 0 }),
    data: Type.Array(itemsSchema)
  })
}
