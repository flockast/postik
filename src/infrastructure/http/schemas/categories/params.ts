import { Type } from '@sinclair/typebox'

export const CategoryId = Type.Object({
  categoryId: Type.Number()
})

export const CategorySlug = Type.Object({
  categorySlug: Type.String()
})
