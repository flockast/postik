import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { PostSchemas } from '../../../schemas'
import { decodeSort } from '../../../utils/decodeSort'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/', {
    schema: {
      tags: ['Posts'],
      querystring: PostSchemas.Queries.PostsQuery,
      response: {
        200: PostSchemas.Bodies.PostsPaginated
      }
    }
  }, (request) => {
    const { offset, limit, sort } = request.query

    return app.postsService.findAll(
      { offset: offset!, limit: limit! },
      // @ts-ignore
      decodeSort(sort!)
    )
  })

  app.get('/:postId', {
    schema: {
      tags: ['Posts'],
      params: PostSchemas.Params.PostId,
      response: {
        200: PostSchemas.Bodies.Post
      }
    }
  }, (request) => {
    const { postId } = request.params
    return app.postsService.findById(postId!)
  })
}

export default route
