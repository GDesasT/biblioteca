import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'loans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
      table.integer('book_id').unsigned().notNullable().references('id').inTable('books')
      table.timestamp('loan_date').notNullable()
      table.timestamp('due_date').notNullable()
      table.timestamp('returned_at').nullable()
      table.integer('renewal_count').unsigned().notNullable().defaultTo(0)
      table.enu('status', ['ACTIVE', 'RENEWED', 'RETURNED', 'OVERDUE']).notNullable().defaultTo('ACTIVE')
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['user_id', 'status'])
      table.index(['book_id', 'status'])
      table.index(['due_date', 'status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
