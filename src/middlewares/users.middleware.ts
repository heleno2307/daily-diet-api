import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'

import { routeSchemaValidation } from '../utils/route-shema-validation'
import { isUserExisting } from './global.middlewares'

const bodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

export type UserBody = z.infer<typeof bodySchema>

// Valida o body recebido
export async function newUserParams(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  routeSchemaValidation(bodySchema, request.body, reply)
}

// Verifica se usuário ja existe
export async function checkUserExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const body = request.body as UserBody

  if (await isUserExisting(body.name, body.email)) {
    return reply.status(400).send({
      error: 'existing user with "name" and "email" registered.',
    })
  }
}

export interface LoginRequest extends FastifyRequest {
  password?: string
  email?: string
}

// Valida as credencias do login
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
