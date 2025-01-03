import { knex } from '../database'

// Realiza a consulta no banco de dados e retorna se o usuário existe
export async function isUserExisting(
  name?: string,
  email?: string,
  id?: string,
) {
  const query = knex('users')

  if (!id) {
    query.where({ name, email })
  } else {
    query.where('id', id)
  }

  const response = await query.first()
  return !!response
}
