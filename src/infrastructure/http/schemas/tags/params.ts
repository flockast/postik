import { Type } from '@sinclair/typebox'

export const TagId = Type.Object({
  tagId: Type.Number()
})

export const TagSlug = Type.Object({
  tagSlug: Type.String()
})
