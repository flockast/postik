import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { DATA } from '../../../db'
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

    return {
      count: DATA.POSTS.length,
      data: DATA.POSTS.slice(offset, (offset || 0) + (limit || 0))
    }
  })

  app.get('/:postId', {
    schema: {
      params: PostSchemas.Params.PostId,
      response: {
        200: PostSchemas.Bodies.Post
      }
    }
  }, async (request, response) => {
    const { postId } = request.params

    const post = DATA.POSTS.find((item) => `${item.id}` === `${postId}`)

    if (!post) {
      throw app.httpErrors.notFound()
    }

    return post
  })
}

export default route

