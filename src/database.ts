import { knex as setupKnex, Knex } from 'knex'
import { env } from './env'

export const config: Knex.Config = {
  client: 'sqlite',
  connection: {
    filename: env.DATABASE_URL,
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './database/migrations',
  },
  pool: {
    afterCreate: (conn: any, done: any) => {
      // Habilita chaves estrangeiras quando uma conexão com o SQLite é criada.
      conn.run('PRAGMA foreign_keys = ON', done)
    },
  },
}

export const knex = setupKnex(config)
