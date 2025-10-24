import { Type } from '@sinclair/typebox'
import CommonSchemas from '../commons'

export const Post = Type.Object({
  id: Type.Number(),
  slug: Type.String({
    pattern: '^[a-z0-9]+(?:[-_][a-z0-9]+)*$'
  }),
  title: Type.String(),
  content: Type.String()
})

export const CreatePost = Type.Pick(Post, ['title', 'content', 'slug'])

export const UpdatePost = Type.Partial(CreatePost)

export const PostsPaginated = CommonSchemas.Bodies.PaginationResult(Post)
