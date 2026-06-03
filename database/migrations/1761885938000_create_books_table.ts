import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'books'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('title', 220).notNullable()
      table.string('author', 160).notNullable()
      table.integer('publisher_id').unsigned().notNullable().references('id').inTable('publishers')
      table.integer('category_id').unsigned().notNullable().references('id').inTable('categories')
      table.string('isbn', 32).notNullable().unique()
      table.text('description').nullable()
      table.enu('type', ['physical', 'digital', 'audiobook']).notNullable().defaultTo('physical')
      table.integer('total_units').unsigned().notNullable().defaultTo(1)
      table.integer('available_units').unsigned().notNullable().defaultTo(1)
      table.string('cover_image', 255).nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.index(['title', 'author'])
      table.index(['publisher_id', 'category_id'])
      table.index(['type', 'available_units'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
