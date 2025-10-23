import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { PostSchemas, CommonsSchemas } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/', {
    schema: {
      querystring: CommonsSchemas.Queries.Pagination,
      response: {
        200: PostSchemas.Bodies.PostsPaginated
      }
    }
  }, async (request) => {
    const { offset, limit } = request.query

    const countQuery = app.db
      .selectFrom('posts')
      .select(({ fn }) => (
        [fn.count<number>('id').as('count')]
      ))
      .executeTakeFirst()

    const postsQuery = app.db
      .selectFrom('posts')
      .offset(offset!)
      .limit(limit!)
      .select([
        'id',
        'title',
        'content',
      ])
      .orderBy('created_at', 'asc')
      .execute()

    const [countResult, postsResult] = await Promise.all([countQuery, postsQuery])

    return {
      count: countResult?.count ?? 0,
      data: postsResult,
    }
  })

  app.get('/:postId', {
    schema: {
      params: PostSchemas.Params.PostId,
      response: {
        200: PostSchemas.Bodies.Post
      }
    }
  }, async (request) => {
    const { postId } = request.params

    const post = app.db
      .selectFrom('posts')
      .where('id', '=', Number(postId))
      .select([
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
