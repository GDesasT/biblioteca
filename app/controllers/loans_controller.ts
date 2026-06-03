import Book from '#models/book'
import Loan from '#models/loan'
import Role from '#models/role'
import User from '#models/user'
import LoanService from '#services/loan_service'
import { createLoanValidator, updateLoanValidator } from '#validators/loan'
import type { HttpContext } from '@adonisjs/core/http'

export default class LoansController {
  async index({ request, view }: HttpContext) {
    await LoanService.syncOverdueLoans()

    const page = request.input('page', 1)
    const filters = {
      search: request.input('search', ''),
      status: request.input('status', ''),
    }

    const query = Loan.query().preload('user').preload('book')

    if (filters.status) {
      query.where('status', filters.status)
    }

    if (filters.search) {
      const like = `%${filters.search}%`
      query.where((builder) => {
        builder
          .whereHas('user', (user) => {
            user.where('fullName', 'like', like).orWhere('userNumber', 'like', like)
          })
          .orWhereHas('book', (book) => {
            book.where('title', 'like', like).orWhere('isbn', 'like', like)
          })
      })
    }

    const loans = await query.orderBy('createdAt', 'desc').paginate(page, 12)
    loans.baseUrl('/loans')
    loans.queryString(filters)

    return view.render('loans/index', { loans, filters })
  }

  async create({ view }: HttpContext) {
    const studentRole = await Role.findByOrFail('name', 'Estudiante')
    const [users, books] = await Promise.all([
      User.query().where('roleId', studentRole.id).orderBy('fullName', 'asc'),
      Book.query().where('availableUnits', '>', 0).orderBy('title', 'asc'),
    ])

    return view.render('loans/form', { loan: null, users, books })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createLoanValidator)

    try {
      await LoanService.checkout(payload.userId, payload.bookId, payload.days ?? 14)
      session.flash('success', 'Prestamo registrado correctamente.')
      response.redirect().toPath('/loans')
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'No se pudo registrar el prestamo.')
      response.redirect().back('/loans/create')
    }
  }

  async edit({ params, view }: HttpContext) {
    const loan = await Loan.query().where('id', params.id).preload('user').preload('book').firstOrFail()
    return view.render('loans/edit', { loan })
  }

  async update({ params, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(updateLoanValidator)
    const loan = await Loan.findOrFail(params.id)

    if (payload.status === 'RETURNED' && loan.status !== 'RETURNED') {
      await LoanService.returnLoan(loan.id)
      session.flash('success', 'Prestamo marcado como devuelto.')
      return response.redirect().toPath('/loans')
    }

    if (loan.status === 'RETURNED' && payload.status !== 'RETURNED') {
      session.flash('error', 'No puedes reabrir un prestamo devuelto desde esta pantalla.')
      return response.redirect().back(`/loans/${loan.id}/edit`)
    }

    loan.merge({
      dueDate: payload.dueDate,
      status: payload.status,
      renewalCount: payload.renewalCount,
    })
    await loan.save()

    session.flash('success', 'Prestamo actualizado correctamente.')
    response.redirect().toPath('/loans')
  }

  async returnLoan({ params, response, session }: HttpContext) {
    try {
      await LoanService.returnLoan(params.id)
      session.flash('success', 'Devolucion registrada correctamente.')
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'No se pudo registrar la devolucion.')
    }

    response.redirect().back('/loans')
  }

  async renew({ params, response, session }: HttpContext) {
    try {
      await LoanService.renewLoan(params.id)
      session.flash('success', 'Prestamo renovado por 7 dias.')
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'No se pudo renovar el prestamo.')
    }

    response.redirect().back('/loans')
  }

  async destroy({ params, response, session }: HttpContext) {
    const loan = await Loan.findOrFail(params.id)

    if (loan.status !== 'RETURNED') {
      session.flash('error', 'Solo puedes eliminar prestamos ya devueltos.')
      return response.redirect().back('/loans')
    }

    await loan.delete()
    session.flash('success', 'Prestamo eliminado correctamente.')
    response.redirect().toPath('/loans')
  }
}
