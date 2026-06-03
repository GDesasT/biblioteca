import LoanService from '#services/loan_service'
import db from '@adonisjs/lucid/services/db'
import type { HttpContext } from '@adonisjs/core/http'

export default class ReportsController {
  async index({ view }: HttpContext) {
    await LoanService.syncOverdueLoans()

    const monthlyLoans = await db
      .from('loans')
      .select(db.raw("DATE_FORMAT(loan_date, '%Y-%m') as period"))
      .count('id as total')
      .groupBy('period')
      .orderBy('period', 'desc')
      .limit(6)

    const topBooks = await db
      .from('loans')
      .join('books', 'books.id', 'loans.book_id')
      .select('books.title', 'books.author')
      .count('loans.id as total')
      .groupBy('books.title', 'books.author')
      .orderBy('total', 'desc')
      .limit(10)

    const popularCategories = await db
      .from('loans')
      .join('books', 'books.id', 'loans.book_id')
      .join('categories', 'categories.id', 'books.category_id')
      .select('categories.name')
      .count('loans.id as total')
      .groupBy('categories.name')
      .orderBy('total', 'desc')
      .limit(10)

    const overdueUsers = await db
      .from('loans')
      .join('users', 'users.id', 'loans.user_id')
      .join('books', 'books.id', 'loans.book_id')
      .select('users.full_name', 'users.user_number', 'books.title', 'loans.due_date')
      .where('loans.status', 'OVERDUE')
      .orderBy('loans.due_date', 'asc')
      .limit(10)

    return view.render('reports/index', { monthlyLoans, topBooks, popularCategories, overdueUsers })
  }
}
