import Book from '#models/book'
import Publisher from '#models/publisher'
import { publisherValidator } from '#validators/publisher'
import type { HttpContext } from '@adonisjs/core/http'

export default class PublishersController {
  async index({ request, view }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const query = Publisher.query().withCount('books')

    if (search) {
      const like = `%${search}%`
      query.where((builder) => builder.where('name', 'like', like).orWhere('country', 'like', like))
    }

    const publishers = await query.orderBy('name', 'asc').paginate(page, 12)
    publishers.baseUrl('/publishers')
    publishers.queryString({ search })

    return view.render('publishers/index', { publishers, search })
  }

  async create({ view }: HttpContext) {
    return view.render('publishers/form', { publisher: null })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(publisherValidator)
    const duplicate = await Publisher.findBy('name', payload.name)

    if (duplicate) {
      session.flash('error', 'Ya existe una editorial con ese nombre.')
      return response.redirect().back('/publishers/create')
    }

    await Publisher.create(payload)
    session.flash('success', 'Editorial creada correctamente.')
    response.redirect().toPath('/publishers')
  }

  async edit({ params, view }: HttpContext) {
    const publisher = await Publisher.findOrFail(params.id)
    return view.render('publishers/form', { publisher })
  }

  async update({ params, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(publisherValidator)
    const publisher = await Publisher.findOrFail(params.id)
    const duplicate = await Publisher.query()
      .where('name', payload.name)
      .whereNot('id', publisher.id)
      .first()

    if (duplicate) {
      session.flash('error', 'Ya existe otra editorial con ese nombre.')
      return response.redirect().back(`/publishers/${publisher.id}/edit`)
    }

    publisher.merge(payload)
    await publisher.save()
    session.flash('success', 'Editorial actualizada correctamente.')
    response.redirect().toPath('/publishers')
  }

  async destroy({ params, response, session }: HttpContext) {
    const publisher = await Publisher.findOrFail(params.id)
    const hasBooks = await Book.query().where('publisherId', publisher.id).first()

    if (hasBooks) {
      session.flash('error', 'No puedes eliminar una editorial con libros asociados.')
      return response.redirect().back('/publishers')
    }

    await publisher.delete()
    session.flash('success', 'Editorial eliminada correctamente.')
    response.redirect().toPath('/publishers')
  }
}
