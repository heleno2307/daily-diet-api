import { FastifyInstance } from 'fastify'
import {
  createNewSnack,
  deleteSnack,
  updateSnack,
} from '../controllers/snacks.controller'
import {
  checkSnackExists,
  cookiesValidation,
  createNewSnackParams,
  updateSnackParams,
  deleteSnackParams,
} from '../middlewares/snacks.middlewares'

export async function snacksRoutes(app: FastifyInstance) {
  app.addHook('preHandler', cookiesValidation)

  // Cria uma nova snack
  app.post(
    '/',
    {
      preHandler: [createNewSnackParams],
    },
    createNewSnack,
  )

  // Atualiza a snack
  app.patch(
    '/:id',
    { preHandler: [updateSnackParams, checkSnackExists] },
    updateSnack,
  )

  // excluir a snak
  app.delete(
    '/:id',
    { preHandler: [deleteSnackParams, checkSnackExists] },
    deleteSnack,
  )
}
