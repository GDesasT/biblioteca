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

    const monthlyLoansChronological = [...monthlyLoans].reverse()
    const monthlyLoansChart = {
      labels: monthlyLoansChronological.map((row) => row.period),
      values: monthlyLoansChronological.map((row) => Number(row.total ?? 0)),
    }
    const topBooksChart = {
      labels: topBooks.map((book) => book.title),
      values: topBooks.map((book) => Number(book.total ?? 0)),
    }
    const popularCategoriesChart = {
      labels: popularCategories.map((category) => category.name),
      values: popularCategories.map((category) => Number(category.total ?? 0)),
    }

    return view.render('reports/index', {
      monthlyLoans,
      topBooks,
      popularCategories,
      overdueUsers,
      monthlyLoansChart: JSON.stringify(monthlyLoansChart),
      topBooksChart: JSON.stringify(topBooksChart),
      popularCategoriesChart: JSON.stringify(popularCategoriesChart),
    })
  }
}
