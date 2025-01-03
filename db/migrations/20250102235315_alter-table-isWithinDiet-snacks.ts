import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('snacks', (table) => {
    table.boolean('isWithinDiet').after('description').defaultTo(true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('snacks', (table) => {
    table.dropColumn('isWithinDiet')
  })
}
