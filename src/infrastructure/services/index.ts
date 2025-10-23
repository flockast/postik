import fp from 'fastify-plugin'
import { type IPostRepository, PostService } from '../../application'
import { PostDao } from '../dao/postDao'

declare module 'fastify' {
  interface FastifyInstance {
    postsService: PostService
  }
}

export default fp(async (app) => {
  const postsRepository: IPostRepository = new PostDao(app.db)
  const postsService = new PostService(postsRepository)
  app.decorate('postsService', postsService)
})
