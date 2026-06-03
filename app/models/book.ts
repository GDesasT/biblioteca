import Category from '#models/category'
import Loan from '#models/loan'
import Publisher from '#models/publisher'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export type BookType = 'physical' | 'digital' | 'audiobook'

export default class Book extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare title: string

  @column()
  declare author: string

  @column()
  declare publisherId: number

  @column()
  declare categoryId: number

  @column()
  declare isbn: string

  @column()
  declare description: string | null

  @column()
  declare type: BookType

  @column()
  declare totalUnits: number

  @column()
  declare availableUnits: number

  @column()
  declare coverImage: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Publisher)
  declare publisher: BelongsTo<typeof Publisher>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => Loan)
  declare loans: HasMany<typeof Loan>

  get loanedUnits() {
    return Math.max(this.totalUnits - this.availableUnits, 0)
  }

  get isAvailable() {
    return this.availableUnits > 0
  }
}
