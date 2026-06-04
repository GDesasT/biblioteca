import vine from '@vinejs/vine'

export const updateProfileValidator = vine.create({
  fullName: vine.string().trim().minLength(3).maxLength(160),
  email: vine.string().trim().email().maxLength(254),
})

export const updatePasswordValidator = vine.create({
  password: vine.string().minLength(8).maxLength(64),
  passwordConfirmation: vine.string().minLength(8).maxLength(64),
})
