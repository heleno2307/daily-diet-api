import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'child_process'
import request from 'supertest'

describe('Snacks Routes', () => {
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

  it('should be able to create a new snack from a user', async () => {
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

    const cookies = response.headers['set-cookie']

    await request(app.server)
      .post('/snacks')
      .set('Cookie', cookies)
      .send({
        name: 'apple',
        description: 'apple',
        isWithinDiet: true,
        date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .expect(201)
  })

  it('should be able to list all snacks from a user', async () => {
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

    const loginResponse = await request(app.server)
      .post('/users/auth/login')
      .set('Authorization', `Basic ${credentials}`)
      .expect(204)

    const cookies = loginResponse.headers['set-cookie']

    await request(app.server)
      .post('/snacks')
      .set('Cookie', cookies)
      .send({
        name: 'apple',
        description: 'apple',
        isWithinDiet: true,
        date: new Date(),
      })
      .expect(201)

    const snackResponse = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookies)
      .expect(200)

    expect(snackResponse.body.snacks).toHaveLength(1)

    // This validate if the order is correct
    expect(snackResponse.body.snacks[0].name).toBe('apple')
  })

  it('should be able to show a single snack', async () => {
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

    const loginResponse = await request(app.server)
      .post('/users/auth/login')
      .set('Authorization', `Basic ${credentials}`)
      .expect(204)

    const cookies = loginResponse.headers['set-cookie']

    await request(app.server)
      .post('/snacks')
      .set('Cookie', cookies)
      .send({
        name: 'apple',
        description: 'apple',
        isWithinDiet: true,
        date: new Date(),
      })
      .expect(201)

    const snacks = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookies)
      .expect(200)

    const snackResponse = await request(app.server)
      .get(`/snacks/${snacks.body.snacks[0].id}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(snackResponse.body).toEqual({
      snack: expect.objectContaining({
        name: 'apple',
        description: 'apple',
        isWithinDiet: 1,
        date: expect.any(String),
      }),
    })
  })

  it('should be able to update a snack from a user', async () => {
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

    const loginResponse = await request(app.server)
      .post('/users/auth/login')
      .set('Authorization', `Basic ${credentials}`)
      .expect(204)

    const cookies = loginResponse.headers['set-cookie']

    await request(app.server)
      .post('/snacks')
      .set('Cookie', cookies)
      .send({
        name: 'apple',
        description: 'apple',
        isWithinDiet: true,
        date: new Date(),
      })
      .expect(201)

    const snacksResponse = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookies)

    await request(app.server)
      .patch(`/snacks/${snacksResponse.body.snacks[0].id}`)
      .set('Cookie', cookies)
      .send({
        name: 'apple',
        description: 'apple',
        isWithinDiet: true,
        date: new Date(),
      })
      .expect(200)
  })

  it('should be able to delete a snack from a user', async () => {
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

    const loginResponse = await request(app.server)
      .post('/users/auth/login')
      .set('Authorization', `Basic ${credentials}`)
      .expect(204)

    const cookies = loginResponse.headers['set-cookie']

    await request(app.server)
      .post('/snacks')
      .set('Cookie', cookies)
      .send({
        name: 'apple',
        description: 'apple',
        isWithinDiet: true,
        date: new Date(),
      })
      .expect(201)

    const snacksResponse = await request(app.server)
      .get('/snacks')
      .set('Cookie', cookies)

    await request(app.server)
      .delete(`/snacks/${snacksResponse.body.snacks[0].id}`)
      .set('Cookie', cookies)
      .expect(204)
  })

  it('should be able to get metrics from a user', async () => {
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

    const cookies = response.headers['set-cookie']
    // Dados dos snacks a serem criados
    const snacks = [
      {
        name: 'apple',
        description: 'Fresh apple',
        isWithinDiet: true,
        date: new Date(),
      },
      {
        name: 'banana',
        description: 'Ripe banana',
        isWithinDiet: true,
        date: new Date(),
      },
      {
        name: 'cookie',
        description: 'Chocolate chip cookie',
        isWithinDiet: false,
        date: new Date(),
      },
      {
        name: 'carrot',
        description: 'Crunchy carrot',
        isWithinDiet: true,
        date: new Date(),
      },
    ]

    // Criar snacks simultaneamente usando Promise.all
    const createSnackPromises = snacks.map((snack) =>
      request(app.server)
        .post('/snacks')
        .set('Cookie', cookies)
        .send(snack)
        .expect(201),
    )

    // Executar todas as requisições de criação
    await Promise.all(createSnackPromises)

    const metricsResponse = await request(app.server)
      .get('/snacks/metrics/')
      .set('Cookie', cookies)
      .expect(200)

    expect(metricsResponse.body).toEqual({
      totalSnacks: 4,
      totalSnacksOnDiet: 3,
      totalSnacksOffDiet: 1,
      bestOnDietSequence: 2,
    })
  })
})
