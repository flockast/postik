import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { PostSchemas } from '../../../schemas'
import { DATA } from '../../../db/index'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.patch('/:postId', {
    schema: {
      params: PostSchemas.Params.PostId,
      body: PostSchemas.Bodies.UpdatePost,
      response: {
        200: PostSchemas.Bodies.Post
      }
    }
  }, async (request) => {
    const { postId } = request.params

    const postIndex = DATA.POSTS.findIndex((item) => `${item.id}` === `${postId}`)

    if (postIndex === -1) {
      throw app.httpErrors.notFound()
    }

    DATA.POSTS = DATA.POSTS.map((item, index) => (
      index === postIndex
        ? {
          ...item,
          ...request.body
        }
        : item
    ))

    return DATA.POSTS[postIndex]
  })
}

export default route
