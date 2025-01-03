import { FastifyInstance } from 'fastify'
import { metricsController } from '../controllers/metrics.controller'

export async function metricsRoutes(app: FastifyInstance) {
  app.get('/', metricsController)
}
