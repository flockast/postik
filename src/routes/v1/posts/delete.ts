import { type FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { PostSchemas } from '../../../schemas'
import { DATA } from '../../../db/index'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.delete('/:postId', {
    schema: {
      params: PostSchemas.Params.PostId,
      response: {
        200: PostSchemas.Bodies.Post
      }
    }
  }, async (request) => {
    const { postId } = request.params

    const post = DATA.POSTS.find((item) => `${item.id}` === `${postId}`)

    if (!post) {
      throw app.httpErrors.notFound()
    }

    DATA.POSTS = DATA.POSTS.filter((item) => `${item.id}` !== `${post.id}`)

    return post
  })
}

export default route
