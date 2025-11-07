import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { TagsSchema } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/', {
    schema:{
      tags: ['Tags'],
      response: {
        200: TagsSchema.Bodies.TagList
      }
    }
  }, () => {
    return app.tagsService.findAll()
  })

  app.get('/:tagId', {
    schema: {
      tags: ['Tags'],
      params: TagsSchema.Params.TagId,
      response: {
        200: TagsSchema.Bodies.Tag
      }
    }
  }, (request) => {
    const { tagId } = request.params
    return app.tagsService.findById(tagId!)
  })

  app.get('/slug/:tagSlug', {
    schema: {
      tags: ['Tags'],
      params: TagsSchema.Params.TagSlug,
      response: {
        200: TagsSchema.Bodies.Tag
      }
    }
  }, (request) => {
    const { tagSlug } = request.params
    return app.tagsService.findBySlug(tagSlug!)
  })
}

export default route
