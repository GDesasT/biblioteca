import Book from '#models/book'
import Loan from '#models/loan'

const openStatuses = ['ACTIVE', 'RENEWED', 'OVERDUE'] as const

export default class InventoryService {
  static async recalculateBook(bookId: number) {
    const book = await Book.findOrFail(bookId)
    const activeLoans = await Loan.query()
      .where('bookId', bookId)
      .whereIn('status', [...openStatuses])
      .count('* as total')
      .first()

    book.availableUnits = Math.max(book.totalUnits - Number(activeLoans?.$extras.total ?? 0), 0)
    await book.save()

    return book
  }

  static normalizeUnits(totalUnits: number, availableUnits: number) {
    return Math.max(Math.min(availableUnits, totalUnits), 0)
  }
}
