import { Type } from '@sinclair/typebox'

export const Tag = Type.Object({
  id: Type.Number(),
  slug: Type.String(),
  title: Type.String(),
  description: Type.Union([Type.String(), Type.Null()])
})

export const TagList = Type.Array(Tag)

export const TagCreate = Type.Composite([
  Type.Pick(Tag, ['slug', 'title']),
  Type.Partial(Type.Pick(Tag, ['description']))
])

export const TagUpdate = Type.Partial(TagCreate)
