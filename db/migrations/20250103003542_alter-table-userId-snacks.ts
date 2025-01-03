import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('snacks', (table) => {
    table
      .uuid('userId') // Certifique-se de usar o tipo correto (integer, uuid, etc.)
      .notNullable() // Torna o campo obrigatório (opcional, dependendo do caso)
      .references('id') // Define a referência
      .inTable('users') // Indica a tabela referenciada
      .onDelete('CASCADE') // Define o comportamento ao excluir o usuário
      .onUpdate('CASCADE') // Define o comportamento ao atualizar o ID do usuário
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('snacks', (table) => {
    table.dropColumn('userId')
  })
}
