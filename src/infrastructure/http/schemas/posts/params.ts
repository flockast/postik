import { Type } from '@sinclair/typebox'

export const PostId = Type.Object({
  postId: Type.Number()
})

export const Slug = Type.Object({
  slug: Type.String()
})
