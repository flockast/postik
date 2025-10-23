import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { fastify } from 'fastify'
import autoLoad from '@fastify/autoload'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export class Server {
  private static app = fastify({
    logger: {
      transport: {
        target: 'pino-pretty'
      },
    },
  })

  private static async registerSensible() {
    await Server.app.register(import('@fastify/sensible'))
  }

  private static async registerPlugins() {
    await Server.app.register(autoLoad, {
      dir: join(__dirname, 'plugins'),
      forceESM: true
    })
  }

  private static async registerRoutes() {
    await Server.app.register(autoLoad, {
      dir: join(__dirname, 'routes'),
      options: {
        prefix: '/api'
      },
      forceESM: true
    })

    Server.app.ready(() => {
      Server.app.log.info(
        Server.app.printRoutes()
      )
    })
  }

  private static async listenServer() {
    try {
      await Server.app.listen({
        port: 3000,
        host: '0.0.0.0'
      })
    } catch (err) {
      Server.app.log.error(err)
      process.exit(1)
    }
  }

  public static async start() {
    await Server.registerSensible()
    await Server.registerPlugins()
    await Server.registerRoutes()
    await Server.listenServer()
  }
}
