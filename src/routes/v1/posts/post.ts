import { type FastifyPluginAsyncTypebox} from '@fastify/type-provider-typebox'
import { PostSchemas } from '../../../schemas'

const route: FastifyPluginAsyncTypebox = async (app) => {
  app.post('/', {
    schema: {
      body: {
        ...PostSchemas.Bodies.CreatePost,
        required: ['title', 'content']
      },
      response: {
        201: PostSchemas.Bodies.Post,
      }
    }
  }, async (request, reply) => {
    const newPost = await app.db
      .insertInto('posts')
      .values(request.body)
      .returning([
        'id',
        'title',
        'content'
      ])
      .executeTakeFirst()

    reply.status(201).send(newPost)
  })
}

export default route
