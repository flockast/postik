import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { PostSchemas } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.patch('/:postId', {
    schema: {
      tags: ['Posts'],
      params: PostSchemas.Params.PostId,
      body: PostSchemas.Bodies.UpdatePost,
      response: {
        200: PostSchemas.Bodies.Post
      }
    }
  }, (request) => {
    const { postId } = request.params
    return app.postsService.update(postId!, request.body)
  })
}

export default route
