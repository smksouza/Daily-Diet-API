// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      password: string
      created_at: string
      session_id?: string
    }
    meals: {
      id: string
      userId: string
      name: string
      description: string
      IsOnDiet: boolean
      created_at: string
    }
  }
}
