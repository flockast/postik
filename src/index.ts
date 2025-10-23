import { Server } from './infrastructure/server'

const bootstrap = async () => {
  await Server.start()
}

bootstrap()
