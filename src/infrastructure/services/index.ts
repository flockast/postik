import fp from 'fastify-plugin'
import type { ICategoryRepository } from '../../application/repositories/category.repository'
import type{ IPostRepository } from '../../application/repositories/post.repository'
import { CategoriesService } from '../../application/services/category.service'
import { PostsService } from '../../application/services/post.service'
import { CategoryDao } from '../dao/CategoryDao'
import { PostDao } from '../dao/PostDao'

declare module 'fastify' {
  interface FastifyInstance {
    postsService: PostsService
    categoriesService: CategoriesService
  }
}

export default fp(async (app) => {
  const categoriesRepository: ICategoryRepository = new CategoryDao(app.db)
  const categoriesService = new CategoriesService(categoriesRepository)
  app.decorate('categoriesService', categoriesService)

  const postsRepository: IPostRepository = new PostDao(app.db)
  const postsService = new PostsService(postsRepository)
  app.decorate('postsService', postsService)
})
