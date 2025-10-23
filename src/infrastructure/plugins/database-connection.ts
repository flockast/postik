import { type Static, Type } from '@sinclair/typebox'
import { type DB } from 'kysely-codegen'
import { Kysely, PostgresDialect } from 'kysely'
import envSchema from 'env-schema'
import fp from 'fastify-plugin'
import pg from 'pg'

const schema = Type.Object({
  POSTGRES_HOST: Type.String(),
  POSTGRES_PORT: Type.Number(),
  POSTGRES_USER: Type.String(),
  POSTGRES_PASSWORD: Type.String(),
  POSTGRES_DB: Type.String(),
})

const config = envSchema<Static<typeof schema>>({
  schema,
  dotenv: true
})

declare module 'fastify' {
  interface FastifyInstance {
    db: Kysely<DB>
  }
}

export default fp(async (fastify) => {
  fastify.log.info(config, 'Connecting to database')

  const db = new Kysely<DB>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({
        host: config.POSTGRES_HOST,
        port: config.POSTGRES_PORT,
        user: config.POSTGRES_USER,
        password: config.POSTGRES_PASSWORD,
        database: config.POSTGRES_DB
      })
    })
  })

  fastify.decorate('db', db)
  fastify.addHook('onClose', () => db.destroy())
  fastify.log.info(`Connected to database`)
})
