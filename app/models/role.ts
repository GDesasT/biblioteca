import User from '#models/user'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export type RoleName = 'Administrador' | 'Empleado' | 'Estudiante'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: RoleName

  @hasMany(() => User)
  declare users: HasMany<typeof User>
}
