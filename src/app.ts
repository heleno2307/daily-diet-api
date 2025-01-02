import cookie from '@fastify/cookie'
import fastify from 'fastify'
import { usersRoutes } from './routes/users.route'

export const app = fastify()

// Lida com os cookies da aplicação
app.register(cookie)

// Registra as rotas da aplicação
app.register(usersRoutes, {
  prefix: 'users',
})
