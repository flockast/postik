import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { CategorySchema } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.delete('/:categoryId', {
    schema: {
      tags: ['Categories'],
      params: CategorySchema.Params.CategoryId,
      response: {
        200: CategorySchema.Bodies.Category
      }
    }
  }, (request) => {
    const { categoryId } = request.params
    return app.categoryService.delete(categoryId!)
  })
}

export default route
