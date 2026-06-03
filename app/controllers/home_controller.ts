import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ auth, response }: HttpContext) {
    const isLoggedIn = await auth.check()

    if (!isLoggedIn) {
      return response.redirect().toPath('/login')
    }

    await auth.user!.load('role')

    if (auth.user!.role.name === 'Estudiante') {
      return response.redirect().toPath('/student')
    }

    return response.redirect().toPath('/dashboard')
  }
}
