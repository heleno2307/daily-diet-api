// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { knex } from 'knex'

export interface User {
  id: string
  name: string
  email: string
  password: string
  created_at?: string
  update_at?: string
}

export interface Snack {
  id: string
  name: string
  description: string
  isWithinDiet: boolean
  date: Date
  userId: string
  created_at?: string
  update_at?: string
}

declare module 'knex/types/tables' {
  export interface Tables {
    users: User
    snacks: Snack
  }
}
