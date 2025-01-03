import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database'

// Realiza a consulta no banco de dados e retorna se o usuário existe
export async function isUserExisting(
  name?: string,
  email?: string,
  id?: string,
) {
  const query = knex('users')

  if (!id) {
    query.where({ name, email })
  } else {
    query.where('id', id)
  }

  const response = await query.first()
  return !!response
}
export async function cookiesValidation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const token = request.cookies.token

  if (!token) {
    return reply.status(401).send({
      error: 'Unauthorized.',
    })
  }

  if (!(await isUserExisting(undefined, undefined, token))) {
    return reply.status(400).send({
      error: 'A user with the provided name, email, or ID already exists.',
    })
  }
}
