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

export async function getSnackById(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string }
  const userId = request.cookies.token
  const snack = await knex('snacks')
    .where({
      id,
      userId,
    })
    .first()

  return reply.status(200).send({
    snack,
  })
}

export async function getSnacks(request: FastifyRequest, reply: FastifyReply) {
  const { search, isWithinDiet } = request.query as {
    search?: string
    isWithinDiet?: boolean | string
  }

  try {
    const snacksQuery = knex('snacks')
    const userId = request.cookies.token // ID do usuário

    // Adiciona filtro de busca pelo nome ou descrição do snack
    if (search) {
      snacksQuery.where(function () {
        this.where('name', 'like', `%${search}%`).orWhere(
          'description',
          'like',
          `%${search}%`,
        )
      })
    }

    // Adiciona filtro para snacks dentro ou fora da dieta
    if (isWithinDiet !== undefined) {
      const isWithinDietValue =
        isWithinDiet === 'true' || isWithinDiet === '1' ? 1 : 0
      snacksQuery.andWhere('isWithinDiet', isWithinDietValue)
    }

    snacksQuery.andWhere('userId', userId)

    const snacks = await snacksQuery

    return reply.status(200).send({ snacks })
  } catch (error) {
    console.error(error)
    return reply.status(500).send({ error: 'Erro ao buscar snacks' })
  }
}
