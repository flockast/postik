import fp from 'fastify-plugin'
import {
  type IPostRepository, PostsService,
  type ICategoryRepository, CategoriesService
} from '../../application'
import { PostDao } from '../dao/PostDao'
import { CategoryDao } from '../dao/CategoryDao'

declare module 'fastify' {
  interface FastifyInstance {
    postsService: PostsService
    categoriesService: CategoriesService
  }
}

export default fp(async (app) => {
  const postsRepository: IPostRepository = new PostDao(app.db)
  const postsService = new PostsService(postsRepository)
  app.decorate('postsService', postsService)

  const categoriesRepository: ICategoryRepository = new CategoryDao(app.db)
  const categoriesService = new CategoriesService(categoriesRepository)
  app.decorate('categoriesService', categoriesService)
})
