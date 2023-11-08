import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealsBodySchema = z.object({
      userId: z.string(),
      name: z.string(),
      description: z.string(),
      IsOnDiet: z.boolean(),
    })

    const { userId, name, description, IsOnDiet } = createMealsBodySchema.parse(
      request.body,
    )

    const checkUserIdExist = await knex('users')
      .select('*')
      .where('id', userId)
      .first()

    if (!checkUserIdExist) {
      return reply.status(404).send({
        error: 'User Not Found',
      })
    }

    await knex('meals').insert({
      userId,
      name,
      description,
      IsOnDiet,
    })

    return reply.status(201).send()
  })
}
