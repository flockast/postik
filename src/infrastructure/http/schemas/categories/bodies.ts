import { Type } from '@sinclair/typebox'

export const Category = Type.Object({
  id: Type.Number(),
  slug: Type.String(),
  title: Type.String(),
  description: Type.Union([Type.String(), Type.Null()]),
  parentId: Type.Union([Type.Number(), Type.Null()]),
})

export const CategoriesList = Type.Array(Category)

export const CategoryCreate = Type.Composite([
  Type.Pick(Category, ['slug', 'title']),
  Type.Partial(Type.Pick(Category, ['description', 'parentId']))
])

export const CategoryUpdate = Type.Partial(CategoryCreate)
