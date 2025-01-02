import { FastifyInstance } from 'fastify'
import { createNewUser } from '../controllers/users.controller'
import { checkUserExists, newUserParams } from '../middlewares/users.middleware'

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [newUserParams, checkUserExists], // Verifica os parâmetros enviados,
    },
    createNewUser,
  )
}
