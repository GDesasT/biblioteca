import User from '#models/user'
import { updatePasswordValidator, updateProfileValidator } from '#validators/profile'
import type { HttpContext } from '@adonisjs/core/http'

export default class ProfileController {
  async edit({ auth, view }: HttpContext) {
    await auth.user!.load('role')
    return view.render('profile/edit')
  }

  async update({ auth, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(updateProfileValidator)
    const user = auth.user!

    const duplicate = await User.query().where('email', payload.email).whereNot('id', user.id).first()

    if (duplicate) {
      session.flash('error', 'Ese correo ya pertenece a otra cuenta.')
      return response.redirect().back('/profile')
    }

    user.merge(payload)
    await user.save()

    session.flash('success', 'Perfil actualizado correctamente.')
    response.redirect().toPath('/profile')
  }

  async updatePassword({ auth, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(updatePasswordValidator)

    if (payload.password !== payload.passwordConfirmation) {
      session.flash('error', 'La confirmacion de contrasena no coincide.')
      return response.redirect().back('/profile')
    }

    const user = auth.user!
    user.password = payload.password
    await user.save()

    session.flash('success', 'Contrasena actualizada correctamente.')
    response.redirect().toPath('/profile')
  }
}
