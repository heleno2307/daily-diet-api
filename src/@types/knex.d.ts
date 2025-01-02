// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { knex } from 'knex'

export interface Users {
  id: string
  name: string
  email: string
  password: string
  created_at?: string
  update_at?: string
}

declare module 'knex/types/tables' {
  export interface Tables {
    users: Users
  }
}
