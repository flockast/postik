import { type FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { PostSchemas } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.post<{
    Body: Static<typeof PostSchemas.Bodies.CreatePost>
  }>('/', {
    schema: {
      tags: ['Posts'],
      body: PostSchemas.Bodies.CreatePost,
      response: {
        201: PostSchemas.Bodies.Post,
      }
    }
  }, async (request, reply) => {
    const newPost = await app.postsService.create(request.body)
    reply.status(201).send(newPost)
  })
}

export default route
