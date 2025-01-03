import { FastifyInstance } from 'fastify'
import {
  createNewSnack,
  deleteSnack,
  getSnackById,
  updateSnack,
  getSnacks,
} from '../controllers/snacks.controller'
import {
  checkSnackExists,
  createNewSnackParams,
  updateSnackParams,
  deleteSnackParams,
  snacksQueryParams,
} from '../middlewares/snacks.middlewares'

import { cookiesValidation } from '../middlewares/global.middlewares'
import { metricsRoutes } from './metrics.route'

export async function snacksRoutes(app: FastifyInstance) {
  app.addHook('preHandler', cookiesValidation)

  // Sub rota de metricas
  app.register(metricsRoutes, {
    prefix: 'metrics',
  })

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

  // Buscar item pelo id
  app.get('/:id', getSnackById)

  app.get(
    '/',
    {
      preHandler: [snacksQueryParams],
    },
    getSnacks,
  )
}
