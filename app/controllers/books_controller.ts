import Book from '#models/book'
import Category from '#models/category'
import Loan from '#models/loan'
import Publisher from '#models/publisher'
import { bookValidator } from '#validators/book'
import type { HttpContext } from '@adonisjs/core/http'

const openLoanStatuses = ['ACTIVE', 'RENEWED', 'OVERDUE']

export default class BooksController {
  async index({ request, view }: HttpContext) {
    const page = request.input('page', 1)
    const filters = {
      search: request.input('search', ''),
      categoryId: request.input('categoryId', ''),
      publisherId: request.input('publisherId', ''),
      type: request.input('type', ''),
      availability: request.input('availability', ''),
    }

    const query = Book.query().preload('publisher').preload('category')

    if (filters.search) {
      const like = `%${filters.search}%`
      query.where((builder) => {
        builder
          .where('title', 'like', like)
          .orWhere('author', 'like', like)
          .orWhere('isbn', 'like', like)
          .orWhereHas('publisher', (publisher) => publisher.where('name', 'like', like))
          .orWhereHas('category', (category) => category.where('name', 'like', like))
      })
    }

    if (filters.categoryId) query.where('categoryId', filters.categoryId)
    if (filters.publisherId) query.where('publisherId', filters.publisherId)
    if (filters.type) query.where('type', filters.type)
    if (filters.availability === 'available') query.where('availableUnits', '>', 0)
    if (filters.availability === 'unavailable') query.where('availableUnits', 0)

    const books = await query.orderBy('title', 'asc').paginate(page, 10)
    books.baseUrl('/books')
    books.queryString(filters)

    const [categories, publishers] = await Promise.all([
      Category.query().orderBy('name', 'asc'),
      Publisher.query().orderBy('name', 'asc'),
    ])

    return view.render('books/index', { books, categories, publishers, filters })
  }

  async create({ view }: HttpContext) {
    const [categories, publishers] = await Promise.all([
      Category.query().orderBy('name', 'asc'),
      Publisher.query().orderBy('name', 'asc'),
    ])

    return view.render('books/form', { book: null, categories, publishers })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(bookValidator)
    const existing = await Book.findBy('isbn', payload.isbn)

    if (existing) {
      session.flash('error', 'Ya existe un libro con ese ISBN.')
      return response.redirect().back('/books/create')
    }

    await Book.create({
      ...payload,
      description: payload.description ?? null,
      coverImage: payload.coverImage ?? null,
      availableUnits: payload.totalUnits,
    })

    session.flash('success', 'Libro registrado correctamente.')
    response.redirect().toPath('/books')
  }

  async edit({ params, view }: HttpContext) {
    const [book, categories, publishers] = await Promise.all([
      Book.findOrFail(params.id),
      Category.query().orderBy('name', 'asc'),
      Publisher.query().orderBy('name', 'asc'),
    ])

    return view.render('books/form', { book, categories, publishers })
  }

  async update({ params, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(bookValidator)
    const book = await Book.findOrFail(params.id)
    const duplicate = await Book.query().where('isbn', payload.isbn).whereNot('id', book.id).first()

    if (duplicate) {
      session.flash('error', 'Ya existe otro libro con ese ISBN.')
      return response.redirect().back(`/books/${book.id}/edit`)
    }

    const loanedUnits = Math.max(book.totalUnits - book.availableUnits, 0)
    book.merge({
      ...payload,
      description: payload.description ?? null,
      coverImage: payload.coverImage ?? null,
      availableUnits: Math.max(payload.totalUnits - loanedUnits, 0),
    })
    await book.save()

    session.flash('success', 'Libro actualizado correctamente.')
    response.redirect().toPath('/books')
  }

  async destroy({ params, response, session }: HttpContext) {
    const book = await Book.findOrFail(params.id)
    const activeLoan = await Loan.query()
      .where('bookId', book.id)
      .whereIn('status', openLoanStatuses)
      .first()

    if (activeLoan) {
      session.flash('error', 'No puedes eliminar un libro con prestamos activos.')
      return response.redirect().back('/books')
    }

    await book.delete()
    session.flash('success', 'Libro eliminado correctamente.')
    response.redirect().toPath('/books')
  }
}
