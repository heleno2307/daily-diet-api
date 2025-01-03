import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

export async function metricsController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.cookies.token

  const totalSnacksOnDiet = await knex('snacks')
    .where({ userId, isWithinDiet: true })
    .count('id', { as: 'total' })
    .first()

  const totalSnacksOffDiet = await knex('snacks')
    .where({ userId, isWithinDiet: false })
    .count('id', { as: 'total' })
    .first()

  const totalSnacks = await knex('snacks')
    .where({ userId })
    .orderBy('date', 'desc')

  const { bestOnDietSequence } = totalSnacks.reduce(
    (acc, snack) => {
      if (snack.isWithinDiet) {
        acc.currentSequence += 1
      } else {
        acc.currentSequence = 0
      }

      if (acc.currentSequence > acc.bestOnDietSequence) {
        acc.bestOnDietSequence = acc.currentSequence
      }

      return acc
    },
    { bestOnDietSequence: 0, currentSequence: 0 },
  )

  return reply.send({
    totalSnacks: totalSnacks.length,
    totalSnacksOnDiet: totalSnacksOnDiet?.total,
    totalSnacksOffDiet: totalSnacksOffDiet?.total,
    bestOnDietSequence,
  })
}
