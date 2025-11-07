import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { TagsSchema } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.delete('/:tagId', {
    schema: {
      tags: ['Tags'],
      params: TagsSchema.Params.TagId,
      response: {
        200: TagsSchema.Bodies.Tag
      }
    }
  }, (request) => {
    const { tagId } = request.params
    return app.tagsService.delete(tagId!)
  })
}

export default route
