import type { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { CategorySchema } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.get('/', {
    schema:{
      tags: ['Categories'],
      response: {
        200: CategorySchema.Bodies.CategoriesList
      }
    }
  }, () => {
    return app.categoriesService.findAll()
  })

  app.get('/:categoryId', {
    schema: {
      tags: ['Categories'],
      params: CategorySchema.Params.CategoryId,
      response: {
        200: CategorySchema.Bodies.Category
      }
    }
  }, (request) => {
    const { categoryId } = request.params
    return app.categoriesService.findById(categoryId!)
  })

  app.get('/slug/:categorySlug', {
    schema: {
      tags: ['Categories'],
      params: CategorySchema.Params.CategorySlug,
      response: {
        200: CategorySchema.Bodies.Category
      }
    }
  }, (request) => {
    const { categorySlug } = request.params
    return app.categoriesService.findBySlug(categorySlug!)
  })
}

export default route
