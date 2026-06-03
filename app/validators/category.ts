import vine from '@vinejs/vine'

export const categoryValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(120),
})
