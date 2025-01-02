import { FastifyInstance } from 'fastify'
import { createNewUser, login } from '../controllers/users.controller'
import {
  checkUserExists,
  loginParams,
  newUserParams,
} from '../middlewares/users.middleware'

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [newUserParams, checkUserExists], // Verifica os parâmetros enviados,
    },
    createNewUser,
  )

  app.post('/auth/login', { preHandler: [loginParams] }, login)
}
