import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import type { Static } from '@sinclair/typebox'
import { CategorySchema } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.post<{
    Body: Static<typeof CategorySchema.Bodies.CategoryCreate>
  }>('/', {
    schema: {
      tags: ['Categories'],
      body: CategorySchema.Bodies.CategoryCreate,
      response: {
        201: CategorySchema.Bodies.Category
      }
    }
  }, (request, reply) => {
    const newCategory = app.categoriesService.create(request.body)
    reply.status(201).send(newCategory)
  })
}

export default route
