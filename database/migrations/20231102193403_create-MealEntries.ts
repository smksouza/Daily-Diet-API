import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.increments('id').primary()
    table
      .uuid('userId')
      .index()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .notNullable()
    table.text('name').notNullable()
    table.text('description')
    table.boolean('IsOnDiet').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}
