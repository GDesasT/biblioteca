import Book from '#models/book'
import Loan, { MAX_RENEWALS } from '#models/loan'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class LoanService {
  static async syncOverdueLoans() {
    await Loan.query()
      .whereNull('returnedAt')
      .whereIn('status', ['ACTIVE', 'RENEWED'])
      .where('dueDate', '<', DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'))
      .update({ status: 'OVERDUE' })
  }

  static async checkout(userId: number, bookId: number, days = 14) {
    const trx = await db.transaction()

    try {
      const book = await Book.query({ client: trx }).where('id', bookId).forUpdate().firstOrFail()

      if (book.availableUnits <= 0) {
        throw new Error('No hay unidades disponibles para este libro.')
      }

      book.availableUnits -= 1
      await book.useTransaction(trx).save()

      const loan = await Loan.create(
        {
          userId,
          bookId,
          loanDate: DateTime.now(),
          dueDate: DateTime.now().plus({ days }),
          renewalCount: 0,
          status: 'ACTIVE',
        },
        { client: trx }
      )

      await trx.commit()
      return loan
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  static async returnLoan(loanId: number) {
    const trx = await db.transaction()

    try {
      const loan = await Loan.query({ client: trx }).where('id', loanId).forUpdate().firstOrFail()

      if (loan.status === 'RETURNED') {
        throw new Error('Este prestamo ya fue devuelto.')
      }

      const book = await Book.query({ client: trx }).where('id', loan.bookId).forUpdate().firstOrFail()

      loan.returnedAt = DateTime.now()
      loan.status = 'RETURNED'
      await loan.useTransaction(trx).save()

      book.availableUnits = Math.min(book.availableUnits + 1, book.totalUnits)
      await book.useTransaction(trx).save()

      await trx.commit()
      return loan
    } catch (error) {
      await trx.rollback()
      throw error
    }
  }

  static async renewLoan(loanId: number) {
    const loan = await Loan.findOrFail(loanId)

    if (loan.status === 'RETURNED') {
      throw new Error('No se puede renovar un prestamo devuelto.')
    }

    if (loan.status === 'OVERDUE' || loan.dueDate < DateTime.now()) {
      loan.status = 'OVERDUE'
      await loan.save()
      throw new Error('No se puede renovar un prestamo vencido.')
    }

    if (loan.renewalCount >= MAX_RENEWALS) {
      throw new Error('Este prestamo ya alcanzo el maximo de 1 renovacion.')
    }

    loan.renewalCount += 1
    loan.dueDate = loan.dueDate.plus({ days: 7 })
    loan.status = 'RENEWED'
    await loan.save()

    return loan
  }
}
