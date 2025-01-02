import { FastifyReply, FastifyRequest } from 'fastify'
import { LoginRequest, UserBody } from '../middlewares/users.middleware'
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

  return reply.status(201).send()
}

export async function login(request: LoginRequest, reply: FastifyReply) {
  const response = await knex('users')
    .where({
      email: request.email,
      password: request.password,
    })
    .first()

  if (!response) {
    return reply.status(401).send({
      error: 'Invalid email or password. Please try again.',
    })
  }

  reply.cookie('token', response.id, {
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days,
  })

  return reply.status(201).send()
}
