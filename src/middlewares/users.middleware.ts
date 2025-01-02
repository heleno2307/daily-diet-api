import { FastifyRequest, FastifyReply } from 'fastify'
import { z, ZodError } from 'zod'
import { knex } from '../database'

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export type UserBody = z.infer<typeof bodySchema>

export async function newUserParams(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    bodySchema.parse(request.body)
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((issue) => `${issue.message}`)

      // Retorna os erros para o usário
      return reply.status(400).send({
        error: errors,
      })
    } else {
      // Caso tenha um erro não previsto
      return reply.status(500).send(error)
    }
  }
}

export async function checkUserExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = request.body as UserBody
  const response = await knex('users')
    .where({
      name: body.name,
      email: body.email,
    })
    .first()

  if (response) {
    reply.status(400).send({
      error: 'existing user with "name" and "email" registered.',
    })
  }
}
