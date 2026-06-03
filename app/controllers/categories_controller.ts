import Book from '#models/book'
import Category from '#models/category'
import { categoryValidator } from '#validators/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  async index({ request, view }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const query = Category.query().withCount('books')

    if (search) {
      query.where('name', 'like', `%${search}%`)
    }

    const categories = await query.orderBy('name', 'asc').paginate(page, 12)
    categories.baseUrl('/categories')
    categories.queryString({ search })

    return view.render('categories/index', { categories, search })
  }

  async create({ view }: HttpContext) {
    return view.render('categories/form', { category: null })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(categoryValidator)
    const duplicate = await Category.findBy('name', payload.name)

    if (duplicate) {
      session.flash('error', 'Ya existe una categoria con ese nombre.')
      return response.redirect().back('/categories/create')
    }

    await Category.create(payload)
    session.flash('success', 'Categoria creada correctamente.')
    response.redirect().toPath('/categories')
  }

  async edit({ params, view }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    return view.render('categories/form', { category })
  }

  async update({ params, request, response, session }: HttpContext) {
    const payload = await request.validateUsing(categoryValidator)
    const category = await Category.findOrFail(params.id)
    const duplicate = await Category.query().where('name', payload.name).whereNot('id', category.id).first()

    if (duplicate) {
      session.flash('error', 'Ya existe otra categoria con ese nombre.')
      return response.redirect().back(`/categories/${category.id}/edit`)
    }

    category.merge(payload)
    await category.save()
    session.flash('success', 'Categoria actualizada correctamente.')
    response.redirect().toPath('/categories')
  }

  async destroy({ params, response, session }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const hasBooks = await Book.query().where('categoryId', category.id).first()

    if (hasBooks) {
      session.flash('error', 'No puedes eliminar una categoria con libros asociados.')
      return response.redirect().back('/categories')
    }

    await category.delete()
    session.flash('success', 'Categoria eliminada correctamente.')
    response.redirect().toPath('/categories')
  }
}
