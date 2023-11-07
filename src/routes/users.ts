import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select('*')

    return { users }
  })

  app.get('/:id', async (request) => {
    const getUserParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getUserParamsSchema.parse(request.params)
    const user = await knex('users').where('id', id).first()

    return { user }
  })

  app.post('/', async (request, reply) => {
    // { name, email, password }

    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
    })

    const { name, email, password } = createUserBodySchema.parse(request.body)

    const checkUserExist = await knex('users')
      .select('*')
      .where('email', email)
      .first()

    if (checkUserExist) {
      return reply.status(400).send({
        error:
          'Este email já está em uso. Por favor, tente novamente com um email diferente.',
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      password,
    })

    return reply.status(201).send()
  })

  app.delete('/:id', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string(),
    })

    const { id } = getUserParamsSchema.parse(request.params)

    await knex('users').where('id', id).delete()

    return reply.status(204).send()
  })
}
