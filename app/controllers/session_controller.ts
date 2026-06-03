import User from '#models/user'
import { loginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ view }: HttpContext) {
    return view.render('auth/login')
  }

  async store({ request, auth, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)
      session.flash('success', 'Sesion iniciada correctamente.')
      response.redirect().toPath('/')
    } catch {
      session.flash('error', 'El email o la contrasena no son correctos.')
      response.redirect().back('/login')
    }
  }

  async destroy({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Sesion cerrada correctamente.')
    response.redirect().toPath('/login')
  }
}
