import { FastifyInstance } from 'fastify'
import { createNewUser, login, getUser } from '../controllers/users.controller'
import {
  checkUserExists,
  loginParams,
  newUserParams,
} from '../middlewares/users.middleware'
import { cookiesValidation } from '../middlewares/global.middlewares'

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [newUserParams, checkUserExists], // Verifica os parâmetros enviados,
    },
    createNewUser,
  )

  app.post('/auth/login', { preHandler: [loginParams] }, login)

  app.get(
    '/',
    {
      preHandler: [cookiesValidation],
    },
    getUser,
  )
}
