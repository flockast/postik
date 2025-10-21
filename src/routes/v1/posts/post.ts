import { type FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox'
import { DATA } from '../../../db'
import { PostSchemas } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.post('/', {
    schema: {
      body: PostSchemas.Bodies.CreatePost,
      response: {
        201: PostSchemas.Bodies.Post,
      }
    }
  }, async (request, reply) => {
    const { title, content } = request.body

    const newPost = {
      id: DATA.POSTS.length + 1,
      title: title || '',
      content: content || ''
    }

    DATA.POSTS = [
      ...DATA.POSTS,
      newPost
    ]

    reply.status(201)

    return newPost
  })
}

export default route
