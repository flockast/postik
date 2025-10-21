import { Server } from './server'

const bootstrap = async () => {
  await Server.start()
}

bootstrap()
