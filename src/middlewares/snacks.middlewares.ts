import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { routeSchemaValidation } from '../utils/route-shema-validation'
import { knex } from '../database'

const createNewSnackSchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  isWithinDiet: z.boolean(),
})
const updateSnackSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  isWithinDiet: z.boolean().optional(),
})

export type CreateNewSnackBody = z.infer<typeof createNewSnackSchema>
export type UpdateSnackBody = z.infer<typeof updateSnackSchema>

export async function createNewSnackParams(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  routeSchemaValidation(createNewSnackSchema, request.body, reply)
}

export async function updateSnackParams(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  routeSchemaValidation(paramsSchema, request.params, reply)
  routeSchemaValidation(updateSnackSchema, request.body, reply)
}

export async function deleteSnackParams(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  routeSchemaValidation(paramsSchema, request.params, reply)
}

export async function isSnackExisting(id: string) {
  const response = await knex('snacks').where('id', id).first()
  return !!response
}

export async function checkSnackExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id: snackId } = request.params as { id: string } // ID do snack

  if (!(await isSnackExisting(snackId))) {
    return reply.status(400).send({
      error: `Snack with id "${snackId}" not found.`,
    })
  }
}

export async function snacksQueryParams(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const queryParamsSchema = z.object({
    isWithinDiet: z.coerce.boolean().optional(),
    search: z.string().optional(),
  })

  routeSchemaValidation(queryParamsSchema, request.query, reply)
}
