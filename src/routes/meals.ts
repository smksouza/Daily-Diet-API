import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/meals', async () => {
    const users = await knex('users')
      .where('name', 'Samuel Pereira')
      .select('*')

    return users
  })
}
