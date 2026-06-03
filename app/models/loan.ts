import Book from '#models/book'
import User from '#models/user'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export type LoanStatus = 'ACTIVE' | 'RENEWED' | 'RETURNED' | 'OVERDUE'

export default class Loan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare bookId: number

  @column.dateTime()
  declare loanDate: DateTime

  @column.dateTime()
  declare dueDate: DateTime

  @column.dateTime()
  declare returnedAt: DateTime | null

  @column()
  declare renewalCount: number

  @column()
  declare status: LoanStatus

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Book)
  declare book: BelongsTo<typeof Book>

  get daysRemaining() {
    return Math.ceil(this.dueDate.diffNow('days').days)
  }

  get renewalsAvailable() {
    return Math.max(2 - this.renewalCount, 0)
  }
}
