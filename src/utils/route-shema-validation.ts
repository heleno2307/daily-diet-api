import { FastifyReply } from 'fastify'
import { ZodError, ZodObject, ZodRawShape } from 'zod'

export async function routeSchemaValidation<T extends ZodRawShape>(
  schema: ZodObject<T>,
  data: unknown,
  reply: FastifyReply,
) {
  try {
    schema.parse(data)
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.issues.map((issue) => {
        return {
          field: issue.path,
          message: issue.message,
        }
      })

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
