import { afterAll, beforeAll, beforeEach, describe, it, expect } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'child_process'
import request from 'supertest'

describe('Users Routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456',
      })
      .expect(201)
  })

  it('should be able to login in user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456',
      })
      .expect(201)

    const username = 'johndoe@gmail.com'
    const password = '123456'
    const credentials = Buffer.from(`${username}:${password}`).toString(
      'base64',
    )

    const response = await request(app.server)
      .post('/users/auth/login')
      .set('Authorization', `Basic ${credentials}`)
      .expect(204)

    const cookies = response.get('Set-Cookie')

    expect(cookies).toEqual(
      expect.arrayContaining([expect.stringContaining('token')]),
    )
  })
})
