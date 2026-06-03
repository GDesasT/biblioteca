import Loan from '#models/loan'
import Role from '#models/role'
import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

const openLoanStatuses = ['ACTIVE', 'RENEWED', 'OVERDUE']

export default class UsersController {
  async index({ request, view }: HttpContext) {
    const page = request.input('page', 1)
    const filters = {
      search: request.input('search', ''),
      roleId: request.input('roleId', ''),
    }

    const query = User.query().preload('role')

    if (filters.search) {
      const like = `%${filters.search}%`
      query.where((builder) => {
        builder
          .where('fullName', 'like', like)
          .orWhere('email', 'like', like)
          .orWhere('userNumber', 'like', like)
      })
    }

    if (filters.roleId) query.where('roleId', filters.roleId)

    const users = await query.orderBy('fullName', 'asc').paginate(page, 12)
    users.baseUrl('/users')
    users.queryString(filters)

    const roles = await Role.query().orderBy('name', 'asc')
    return view.render('users/index', { users, roles, filters })
  }

  async create({ view }: HttpContext) {
    const roles = await Role.query().orderBy('name', 'asc')
    return view.render('users/form', { userRecord: null, roles })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    const duplicate = await User.query()
      .where('email', payload.email)
      .orWhere('userNumber', payload.userNumber)
      .first()

    if (duplicate) {
      session.flash('error', 'El correo o numero de usuario ya existe.')
      return response.redirect().back('/users/create')
    }

    await User.create(payload)
    session.flash('success', 'Usuario creado correctamente.')
    response.redirect().toPath('/users')
  }

  async edit({ params, view }: HttpContext) {
    const [userRecord, roles] = await Promise.all([
      User.findOrFail(params.id),
      Role.query().orderBy('name', 'asc'),
    ])

    return view.render('users/form', { userRecord, roles })
  }

  async update({ params, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(updateUserValidator)
    const userRecord = await User.findOrFail(params.id)
    const duplicate = await User.query()
      .where((builder) => {
        builder.where('email', payload.email).orWhere('userNumber', payload.userNumber)
      })
      .whereNot('id', userRecord.id)
      .first()

    if (duplicate) {
      session.flash('error', 'El correo o numero de usuario ya pertenece a otra cuenta.')
      return response.redirect().back(`/users/${userRecord.id}/edit`)
    }

    userRecord.merge(payload)
    await userRecord.save()

    session.flash('success', 'Usuario actualizado correctamente.')
    response.redirect().toPath('/users')
  }

  async destroy({ params, auth, response, session }: HttpContext) {
    const userRecord = await User.findOrFail(params.id)

    if (auth.user?.id === userRecord.id) {
      session.flash('error', 'No puedes eliminar tu propia cuenta.')
      return response.redirect().back('/users')
    }

    const activeLoan = await Loan.query()
      .where('userId', userRecord.id)
      .whereIn('status', openLoanStatuses)
      .first()

    if (activeLoan) {
      session.flash('error', 'No puedes eliminar un usuario con prestamos activos.')
      return response.redirect().back('/users')
    }

    await userRecord.delete()
    session.flash('success', 'Usuario eliminado correctamente.')
    response.redirect().toPath('/users')
  }
}
