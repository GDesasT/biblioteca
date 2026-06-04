import Book from '#models/book'
import Loan, { FINE_PER_LATE_DAY } from '#models/loan'
import LoanService from '#services/loan_service'
import RecommendationService from '#services/recommendation_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class StudentController {
  async index({ auth, view }: HttpContext) {
    await LoanService.syncOverdueLoans()

    const loans = await Loan.query()
      .where('userId', auth.user!.id)
      .whereIn('status', ['ACTIVE', 'RENEWED', 'OVERDUE'])
      .preload('book')
      .orderBy('dueDate', 'asc')

    const recommendations = await RecommendationService.forUser(auth.user!.id, 4)

    const allLoans = await Loan.query()
      .where('userId', auth.user!.id)
      .preload('book')
      .orderBy('dueDate', 'asc')

    const fineLoans = allLoans.filter((loan) => loan.fineAmount > 0)
    const activeFineTotal = loans.reduce((total, loan) => total + loan.fineAmount, 0)
    const fineTotal = fineLoans.reduce((total, loan) => total + loan.fineAmount, 0)
    const fineChart = {
      labels: fineLoans.slice(0, 6).map((loan) => loan.book.title),
      values: fineLoans.slice(0, 6).map((loan) => loan.fineAmount),
    }

    return view.render('student/index', {
      loans,
      recommendations,
      fineLoans,
      fineTotal,
      activeFineTotal,
      finePerLateDay: FINE_PER_LATE_DAY,
      fineChart: JSON.stringify(fineChart),
    })
  }

  async history({ auth, view }: HttpContext) {
    const loans = await Loan.query()
      .where('userId', auth.user!.id)
      .preload('book')
      .orderBy('createdAt', 'desc')

    return view.render('student/history', { loans })
  }

  async recommendations({ auth, view }: HttpContext) {
    const recommendations = await RecommendationService.forUser(auth.user!.id, 12)
    return view.render('student/recommendations', { recommendations })
  }

  async requestLoan({ params, auth, response, session }: HttpContext) {
    const book = await Book.findOrFail(params.id)

    try {
      await LoanService.checkout(auth.user!.id, book.id, 14)
      session.flash('success', 'Prestamo solicitado correctamente.')
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'No se pudo solicitar el prestamo.')
    }

    response.redirect().back('/books')
  }

  async renew({ params, auth, response, session }: HttpContext) {
    const loan = await Loan.findOrFail(params.id)

    if (loan.userId !== auth.user!.id) {
      session.flash('error', 'No puedes renovar un prestamo de otro usuario.')
      return response.redirect().back('/student')
    }

    try {
      await LoanService.renewLoan(loan.id)
      session.flash('success', 'Prestamo renovado por 7 dias.')
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'No se pudo renovar el prestamo.')
    }

    response.redirect().back('/student')
  }
}
