import { FastifyReply, FastifyRequest } from 'fastify'
import { UserBody } from '../middlewares/users.middleware'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function createNewUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { email, name, password } = request.body as UserBody
  const id = randomUUID()

  await knex('users').insert({
    id,
    name,
    email,
    password,
  })

  reply.cookie('token', id, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days,
  })

  return reply.status(201).send()
}
