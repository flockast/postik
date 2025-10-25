import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { PostSchemas } from '../../../schemas'
import { decodeSort } from '../../../utils/decodeSort'
import type { Static } from '@sinclair/typebox'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get<{
    Querystring: Static<typeof PostSchemas.Queries.PostsQuery>
  }>('/', {
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
      {
        offset: offset!,
        limit: limit!
      },
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

  app.get('/slug/:slug', {
    schema: {
      tags: ['Posts'],
      params: PostSchemas.Params.Slug,
      response: {
        200: PostSchemas.Bodies.Post
      }
    }
  }, (request) => {
    const { slug } = request.params
    return app.postsService.findBySlug(slug!)
  })
}

export default route
