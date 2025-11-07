import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { CategorySchema } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.patch('/:categoryId', {
    schema: {
      tags: ['Categories'],
      params: CategorySchema.Params.CategoryId,
      body: CategorySchema.Bodies.CategoryUpdate,
      response: {
        200: CategorySchema.Bodies.Category
      }
    }
  }, (request) => {
    const { categoryId } = request.params
    return app.categoryService.update(categoryId!, request.body)
  })
}

export default route
