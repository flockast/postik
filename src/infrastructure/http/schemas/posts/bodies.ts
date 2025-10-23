import { Type } from '@sinclair/typebox'
import CommonSchemas from '../commons'

export const Post = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  content: Type.String()
})

export const CreatePost = Type.Pick(Post, ['title', 'content'])

export const UpdatePost = Type.Partial(CreatePost)

export const PostsPaginated = CommonSchemas.Bodies.PaginationResult(Post)
