import { type FastifyInstance, type FastifyRequest } from 'fastify'
import { DATA } from '../../../db'

export default async (app: FastifyInstance) => {
  app.post('/', async (req: FastifyRequest<{ Body: { title: string } }>) => {
    const title: string = req.body.title

    const newPost = {
      id: DATA.POSTS.length + 1,
      title
    }

    DATA.POSTS = [
      ...DATA.POSTS,
      newPost
    ]

    return {
      data: newPost
    }
  })
}
