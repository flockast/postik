import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { sql } from 'kysely'
import { PostSchemas } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.patch('/:postId', {
    schema: {
      params: PostSchemas.Params.PostId,
      body: PostSchemas.Bodies.UpdatePost,
      response: {
        200: PostSchemas.Bodies.Post
      }
    }
  }, async (request) => {
    const { postId } = request.params

    const post = await app.db
      .updateTable('posts')
      .set({
        ...request.body,
        updated_at: sql`CURRENT_TIMESTAMP`
      })
      .where('id', '=', Number(postId))
      .returning([
        'id',
        'title',
        'content',
      ])
      .executeTakeFirst()

    if (!post) {
      throw app.httpErrors.notFound()
    }

    return post
  })
}

export default route
