import { FastifyReply, FastifyRequest } from 'fastify'
import { CreateNewSnackBody } from '../middlewares/snacks.middlewares'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function createNewSnack(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { date, description, name, isWithinDiet } =
    request.body as CreateNewSnackBody

  const userId = request.cookies.token

  await knex('snacks').insert({
    id: randomUUID(),
    description,
    name,
    date,
    isWithinDiet,
    userId,
  })

  return reply.status(201).send()
}

export async function updateSnack(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { date, description, name, isWithinDiet } =
    request.body as CreateNewSnackBody

  const userId = request.cookies.token // ID do usuário
  const { id: snackId } = request.params as { id: string } // ID do snack

  // Atualiza os dados do snack no banco
  const updatedRows = await knex('snacks')
    .where({ id: snackId, userId })
    .update({
      description,
      name,
      date,
      isWithinDiet,
      update_at: knex.fn.now(),
    })
    .returning('*')

  return reply.status(200).send({
    snack: updatedRows,
  })
}

export async function deleteSnack(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userId = request.cookies.token // ID do usuário
  const { id: snackId } = request.params as { id: string } // ID do snack

  // deleta os dados do snack no banco
  await knex('snacks').where({ id: snackId, userId }).delete()

  return reply.status(204).send()
}
