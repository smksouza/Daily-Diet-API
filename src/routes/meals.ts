import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/summary',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const [user] = await knex('users')
        .where('session_id', sessionId)
        .select('id')

      const userId = user.id

      const meals = await knex('meals').where('userId', userId)

      let bestSequence = 0
      let currentSequence = 0
      let onDiet = 0
      let offDiet = 0

      for (const meal of meals) {
        if (meal.IsOnDiet) {
          currentSequence++
          onDiet++
          bestSequence = Math.max(bestSequence, currentSequence)
        } else {
          currentSequence = 0
          offDiet++
        }
      }

      const totalMeals = meals.length

      return { totalMeals, onDiet, offDiet, bestSequence }
    },
  )

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies
      const [user] = await knex('users')
        .where('session_id', sessionId)
        .select('id')

      const userId = user.id

      const meals = await knex('meals').where('userId', userId)

      return { meals }
    },
  )
  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getMealParamsSchema = z.object({
        id: z.string(),
      })
      const { sessionId } = request.cookies
      const [user] = await knex('users')
        .where('session_id', sessionId)
        .select('id')

      const userId = user.id

      const { id } = getMealParamsSchema.parse(request.params)

      const meals = await knex('meals')
        .select('*')
        .where('id', id)
        .andWhere('userId', userId)
        .first()

      return { meals }
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const [user] = await knex('users')
        .where('session_id', sessionId)
        .select('id')

      const userId = user.id

      const createMealsBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        IsOnDiet: z.boolean(),
      })

      const { name, description, IsOnDiet } = createMealsBodySchema.parse(
        request.body,
      )

      await knex('meals').insert({
        userId,
        name,
        description,
        IsOnDiet,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const [user] = await knex('users')
        .where('session_id', sessionId)
        .select('id')

      const userId = user.id

      const getMealParamsSchema = z.object({
        id: z.string(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const editMealsBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        IsOnDiet: z.boolean().optional(),
      })

      const { name, description, IsOnDiet } = editMealsBodySchema.parse(
        request.body,
      )

      const meal = await knex('meals')
        .where('id', id)
        .andWhere('userId', userId)
        .update({
          name,
          description,
          IsOnDiet,
        })

      if (!meal) {
        return reply.status(404).send({
          error: 'Refeição não encontrada',
        })
      }

      return reply.status(202).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const { sessionId } = request.cookies
      const [user] = await knex('users')
        .where('session_id', sessionId)
        .select('id')

      const userId = user.id

      const getMealParamsSchema = z.object({
        id: z.string(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      await knex('meals').where('id', id).andWhere('userId', userId).delete()

      return reply.code(204).send()
    },
  )
}
