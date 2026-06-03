import Book from '#models/book'
import Category from '#models/category'
import Publisher from '#models/publisher'
import type { HttpContext } from '@adonisjs/core/http'

export default class InventoryController {
  async index({ request, view }: HttpContext) {
    const page = request.input('page', 1)
    const search = request.input('search', '')
    const query = Book.query().preload('publisher').preload('category')

    if (search) {
      const like = `%${search}%`
      query.where((builder) => {
        builder.where('title', 'like', like).orWhere('isbn', 'like', like).orWhere('author', 'like', like)
      })
    }

    const books = await query.orderBy('availableUnits', 'asc').paginate(page, 12)
    books.baseUrl('/inventory')
    books.queryString({ search })

    const [categoriesCount, publishersCount] = await Promise.all([
      Category.query().count('* as total').first(),
      Publisher.query().count('* as total').first(),
    ])

    return view.render('inventory/index', {
      books,
      search,
      summary: {
        categories: Number(categoriesCount?.$extras.total ?? 0),
        publishers: Number(publishersCount?.$extras.total ?? 0),
      },
    })
  }
}
