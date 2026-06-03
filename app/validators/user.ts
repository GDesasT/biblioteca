import vine from '@vinejs/vine'

export const createUserValidator = vine.create({
  userNumber: vine.string().trim().minLength(3).maxLength(40),
  fullName: vine.string().trim().minLength(3).maxLength(160),
  email: vine.string().trim().email().maxLength(254),
  password: vine.string().minLength(8).maxLength(64),
  roleId: vine.number().positive(),
})

export const updateUserValidator = vine.create({
  userNumber: vine.string().trim().minLength(3).maxLength(40),
  fullName: vine.string().trim().minLength(3).maxLength(160),
  email: vine.string().trim().email().maxLength(254),
  roleId: vine.number().positive(),
})
