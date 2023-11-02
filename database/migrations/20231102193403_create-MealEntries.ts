import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.increments('id').primary()
    table.uuid('user_id').index()
    table.text('name').notNullable()
    table.text('description')
    table.boolean('IsOnDiet')
    table.dateTime('created_at')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}