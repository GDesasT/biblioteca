import type { RoleName } from '#models/role'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class RoleMiddleware {
  async handle(ctx: HttpContext, next: NextFn, allowedRoles: RoleName[] = []) {
    await ctx.auth.authenticate()

    const user = ctx.auth.user!
    await user.load('role')

    if (!allowedRoles.includes(user.role.name)) {
      ctx.session.flash('error', 'No tienes permisos para acceder a esta seccion.')
      return ctx.response.redirect().back()
    }

    return next()
  }
}
