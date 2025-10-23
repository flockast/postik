import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { PostSchemas } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.delete('/:postId', {
    schema: {
      params: PostSchemas.Params.PostId,
      response: {
        200: PostSchemas.Bodies.Post
      }
    }
  }, async (request) => {
    const { postId } = request.params

    const post = await app.db
      .deleteFrom('posts')
      .where('id', '=', Number(postId))
      .returning([
        'id',
        'title',
        'content'
      ])
      .executeTakeFirst()

    if (!post) {
      throw app.httpErrors.notFound()
    }

    return post
  })
}

export default route
