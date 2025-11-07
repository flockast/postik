import fp from 'fastify-plugin'
import type { ICategoryRepository } from '../../application/repositories/category.repository'
import type{ IPostRepository } from '../../application/repositories/post.repository'
import { CategoryService } from '../../application/services/category.service'
import { PostService } from '../../application/services/post.service'
import { CategoryDao } from '../dao/category/CategoryDao'
import { PostDao } from '../dao/post/PostDao'
import type { ITagRepository } from '../../application/repositories/tag.repository'
import { TagDao } from '../dao/tag/TagDao'
import { TagService } from '../../application/services/tag.service'

declare module 'fastify' {
  interface FastifyInstance {
    postService: PostService
    tagsService: TagService
    categoryService: CategoryService
  }
}

export default fp(async (app) => {
  const categoryRepository: ICategoryRepository = new CategoryDao(app.db)
  const categoryService = new CategoryService(categoryRepository)
  app.decorate('categoryService', categoryService)

  const tagsRepository: ITagRepository = new TagDao(app.db)
  const tagsService = new TagService(tagsRepository)
  app.decorate('tagsService', tagsService)

  const postRepository: IPostRepository = new PostDao(app.db)
  const postService = new PostService(postRepository)
  app.decorate('postService', postService)
})
