import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('user_number', 40).notNullable().unique()
      table.string('full_name', 160).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password').notNullable()
      table.integer('role_id').unsigned().notNullable().references('id').inTable('roles')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
