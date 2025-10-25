import { Type } from '@sinclair/typebox'

export const Category = Type.Object({
  id: Type.Number(),
  slug: Type.String(),
  title: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  parentId: Type.Union([Type.Number(), Type.Null()]),
})

export const CategoriesList = Type.Array(Category)

export const CategoryCreate = Type.Object({
  slug: Type.String({
    pattern: '^[a-z0-9]+(?:[-_][a-z0-9]+)*$'
  }),
  title: Type.String(),
  description: Type.Optional(Type.String()),
  parentId: Type.Optional(Type.Number())
})

export const CategoryUpdate = Type.Partial(CategoryCreate)
