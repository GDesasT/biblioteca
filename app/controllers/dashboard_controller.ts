import LoanService from '#services/loan_service'
import Book from '#models/book'
import Loan from '#models/loan'
import User from '#models/user'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ auth, response, view }: HttpContext) {
    await auth.user!.load('role')

    if (auth.user!.role.name === 'Estudiante') {
      return response.redirect().toPath('/student')
    }

    await LoanService.syncOverdueLoans()

    const [booksCount, usersCount, activeLoansCount, overdueLoansCount, inventoryTotals] =
      await Promise.all([
        Book.query().count('* as total').first(),
        User.query().count('* as total').first(),
        Loan.query().whereIn('status', ['ACTIVE', 'RENEWED']).count('* as total').first(),
        Loan.query().where('status', 'OVERDUE').count('* as total').first(),
        Book.query().sum('totalUnits as totalUnits').sum('availableUnits as availableUnits').first(),
      ])

    const totalUnits = Number(inventoryTotals?.$extras.totalUnits ?? 0)
    const availableUnits = Number(inventoryTotals?.$extras.availableUnits ?? 0)

    const topBooks = await db
      .from('loans')
      .join('books', 'books.id', 'loans.book_id')
      .select('books.id', 'books.title', 'books.author')
      .count('loans.id as total')
      .groupBy('books.id', 'books.title', 'books.author')
      .orderBy('total', 'desc')
      .limit(5)

    const popularCategories = await db
      .from('loans')
      .join('books', 'books.id', 'loans.book_id')
      .join('categories', 'categories.id', 'books.category_id')
      .select('categories.id', 'categories.name')
      .count('loans.id as total')
      .groupBy('categories.id', 'categories.name')
      .orderBy('total', 'desc')
      .limit(5)

    return view.render('dashboard/index', {
      stats: {
        books: Number(booksCount?.$extras.total ?? 0),
        totalUnits,
        availableUnits,
        loanedUnits: Math.max(totalUnits - availableUnits, 0),
        users: Number(usersCount?.$extras.total ?? 0),
        activeLoans: Number(activeLoansCount?.$extras.total ?? 0),
        overdueLoans: Number(overdueLoansCount?.$extras.total ?? 0),
      },
      topBooks,
      popularCategories,
    })
  }
}
