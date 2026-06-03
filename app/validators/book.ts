import vine from '@vinejs/vine'

export const bookValidator = vine.create({
  title: vine.string().trim().minLength(2).maxLength(220),
  author: vine.string().trim().minLength(2).maxLength(160),
  publisherId: vine.number().positive(),
  categoryId: vine.number().positive(),
  isbn: vine.string().trim().minLength(8).maxLength(32),
  description: vine.string().trim().maxLength(2000).nullable().optional(),
  type: vine.enum(['physical', 'digital', 'audiobook']),
  totalUnits: vine.number().min(1),
  coverImage: vine.string().trim().maxLength(255).nullable().optional(),
})
