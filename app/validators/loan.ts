import vine from '@vinejs/vine'

export const createLoanValidator = vine.create({
  userId: vine.number().positive(),
  bookId: vine.number().positive(),
  days: vine.number().min(1).max(60).optional(),
})

export const updateLoanValidator = vine.create({
  dueDate: vine.date(),
  status: vine.enum(['ACTIVE', 'RENEWED', 'RETURNED', 'OVERDUE']),
  renewalCount: vine.number().min(0).max(2),
})
