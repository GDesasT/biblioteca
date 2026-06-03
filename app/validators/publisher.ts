import vine from '@vinejs/vine'

export const publisherValidator = vine.create({
  name: vine.string().trim().minLength(2).maxLength(160),
  country: vine.string().trim().minLength(2).maxLength(120),
})
