import { type FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { TagsSchema } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.post<{
    Body: Static<typeof TagsSchema.Bodies.TagCreate>
  }>('/', {
    schema: {
      tags: ['Tags'],
      body: TagsSchema.Bodies.TagCreate,
      response: {
        201: TagsSchema.Bodies.Tag
      }
    }
  }, async (request, reply) => {
    const newTag = await app.tagsService.create(request.body)
    reply.status(201).send(newTag)
  })
}

export default route
