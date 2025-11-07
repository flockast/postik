import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { TagsSchema } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.patch('/:tagId', {
    schema: {
      tags: ['Tags'],
      params: TagsSchema.Params.TagId,
      body: TagsSchema.Bodies.TagUpdate,
      response: {
        200: TagsSchema.Bodies.Tag
      }
    }
  }, (request) => {
    const { tagId } = request.params
    return app.tagsService.update(tagId!, request.body)
  })
}

export default route
