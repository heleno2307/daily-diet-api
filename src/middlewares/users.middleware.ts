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

export interface LoginRequest extends FastifyRequest {
  password?: string
  email?: string
}

export async function loginParams(request: LoginRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return reply.status(401).send({ message: 'Unauthorized' })
  }

  // Remover o prefixo "Basic " e decodificar as credenciais
  const base64Credentials = authHeader.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')

  // Separar o usuário e a senha
  const [username, password] = credentials.split(':')

  if (!username || !password) {
    return reply.status(401).send({ message: 'Invalid Basic Auth credentials' })
  }

  request.email = username
  request.password = password
}
