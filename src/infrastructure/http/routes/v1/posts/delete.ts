import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { PostSchemas } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.delete('/:postId', {
    schema: {
      tags: ['Posts'],
      params: PostSchemas.Params.PostId,
      response: {
        200: PostSchemas.Bodies.Post
      }
    }
  }, (request) => {
    const { postId } = request.params
    return app.postsService.delete(postId!)
  })
}

export default route
