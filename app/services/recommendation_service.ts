import Book from '#models/book'
import Loan from '#models/loan'

type RecommendationScore = {
  book: Book
  score: number
}

export default class RecommendationService {
  static async forUser(userId: number, limit = 6) {
    const history = await Loan.query().where('userId', userId).preload('book')
    const borrowedBookIds = history.map((loan) => loan.bookId)

    const categoryWeights = new Map<number, number>()
    const authorWeights = new Map<string, number>()

    for (const loan of history) {
      const book = loan.book
      if (!book) continue

      categoryWeights.set(book.categoryId, (categoryWeights.get(book.categoryId) ?? 0) + 2)
      authorWeights.set(book.author, (authorWeights.get(book.author) ?? 0) + 1)
    }

    const candidates = await Book.query()
      .where('availableUnits', '>', 0)
      .if(borrowedBookIds.length > 0, (query) => query.whereNotIn('id', borrowedBookIds))
      .preload('category')
      .preload('publisher')
      .limit(40)

    const scored: RecommendationScore[] = candidates.map((book) => ({
      book,
      score: (categoryWeights.get(book.categoryId) ?? 0) + (authorWeights.get(book.author) ?? 0),
    }))

    const personalized = scored
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.book)
      .slice(0, limit)

    if (personalized.length > 0) {
      return personalized
    }

    return Book.query()
      .where('availableUnits', '>', 0)
      .withCount('loans')
      .preload('category')
      .preload('publisher')
      .orderBy('createdAt', 'desc')
      .limit(limit)
  }
}
