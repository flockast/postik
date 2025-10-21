import { type FastifyInstance, type FastifyRequest, type FastifyReply } from 'fastify'
import { DATA } from '../../../db'

export default async (app: FastifyInstance) => {
  app.get('/', async (req, res) => {
    return {
      data: DATA.POSTS
    }
  })

  app.get('/:id', async (req: FastifyRequest<{ Params: { id: number } }>, res: FastifyReply) => {
    const paramId = +req.params.id

    const findPost = DATA.POSTS.find((item) => {
      return item.id === paramId
    })

    if (!findPost) {
      return res.status(404).send({
        status: `Not found post by id=${paramId}`
      })
    }

    return {
      data: findPost
    }
  })
}
