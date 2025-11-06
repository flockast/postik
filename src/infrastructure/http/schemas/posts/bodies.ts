import { Type } from '@sinclair/typebox'
import CommonSchemas from '../commons'

export const Post = Type.Object({
  id: Type.Number(),
  slug: Type.String({
    pattern: '^[a-z0-9]+(?:[-_][a-z0-9]+)*$'
  }),
  title: Type.String(),
  content: Type.String(),
  categoryId: Type.Union([Type.Number(), Type.Null()])
})

export const PostWithCategory = Type.Composite([
  Post,
  Type.Object({
    category: Type.Union([
      Type.Object({
        id: Type.Number(),
        slug: Type.String(),
        title: Type.String(),
        description: Type.Union([Type.String(), Type.Null()]),
        parentId: Type.Union([Type.Number(), Type.Null()])
      }),
      Type.Null()
    ])
  })
])

export const CreatePost = Type.Composite([
  Type.Pick(Post, ['title', 'content', 'slug']),
  Type.Partial(Type.Pick(Post, ['categoryId']))
])

export const UpdatePost = Type.Partial(CreatePost)

export const PostsPaginated = CommonSchemas.Bodies.PaginationResult(Post)
