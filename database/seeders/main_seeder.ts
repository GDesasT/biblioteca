import Book, { type BookType } from '#models/book'
import Category from '#models/category'
import Loan, { type LoanStatus } from '#models/loan'
import Publisher from '#models/publisher'
import Role, { type RoleName } from '#models/role'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

const roleNames: RoleName[] = ['Administrador', 'Empleado', 'Estudiante']

const publishers = [
  ['Pearson Educacion', 'Mexico'],
  ['McGraw Hill', 'Estados Unidos'],
  ['Alfaomega', 'Colombia'],
  ['Planeta', 'Espana'],
  ['Fondo de Cultura Economica', 'Mexico'],
] as const

const categories = [
  'Programacion',
  'Matematicas',
  'Historia',
  'Literatura',
  'Ciencias',
  'Ingenieria',
  'Administracion',
  'Arte',
  'Idiomas',
  'Psicologia',
]

const titles = [
  'Fundamentos de algoritmos',
  'Calculo aplicado',
  'Historia universal contemporanea',
  'Narrativa latinoamericana',
  'Biologia para laboratorio',
  'Sistemas digitales',
  'Gestion de proyectos',
  'Dibujo y composicion',
  'Ingles academico',
  'Psicologia del aprendizaje',
]

const authors = [
  'Ana Torres',
  'Carlos Mendez',
  'Mariana Ruiz',
  'Jorge Salgado',
  'Lucia Herrera',
  'Roberto Diaz',
  'Elena Pardo',
  'Miguel Nunez',
  'Sofia Castillo',
  'Daniel Ortega',
]

export default class MainSeeder extends BaseSeeder {
  async run() {
    await Loan.query().delete()
    await Book.query().delete()
    await User.query().delete()
    await Publisher.query().delete()
    await Category.query().delete()
    await Role.query().delete()

    const roles = new Map<RoleName, Role>()
    for (const name of roleNames) {
      roles.set(name, await Role.create({ name }))
    }

    const createdPublishers = []
    for (const [name, country] of publishers) {
      createdPublishers.push(await Publisher.create({ name, country }))
    }

    const createdCategories = []
    for (const name of categories) {
      createdCategories.push(await Category.create({ name }))
    }

    const users: User[] = []
    users.push(
      await User.create({
        userNumber: 'ADM-0001',
        fullName: 'Valeria Campos',
        email: 'admin@biblioteca.local',
        password: 'password123',
        roleId: roles.get('Administrador')!.id,
      })
    )

    for (let index = 1; index <= 4; index++) {
      users.push(
        await User.create({
          userNumber: `EMP-${String(index).padStart(4, '0')}`,
          fullName: `Empleado Biblioteca ${index}`,
          email: `empleado${index}@biblioteca.local`,
          password: 'password123',
          roleId: roles.get('Empleado')!.id,
        })
      )
    }

    for (let index = 1; index <= 15; index++) {
      users.push(
        await User.create({
          userNumber: `EST-${String(index).padStart(4, '0')}`,
          fullName: `Estudiante ${index}`,
          email: `estudiante${index}@biblioteca.local`,
          password: 'password123',
          roleId: roles.get('Estudiante')!.id,
        })
      )
    }

    const typeCycle: BookType[] = ['physical', 'digital', 'audiobook']
    const books: Book[] = []
    for (let index = 0; index < 50; index++) {
      const category = createdCategories[index % createdCategories.length]
      const publisher = createdPublishers[index % createdPublishers.length]
      const totalUnits = (index % 6) + 2

      books.push(
        await Book.create({
          title: `${titles[index % titles.length]} Vol. ${Math.floor(index / 10) + 1}`,
          author: authors[index % authors.length],
          publisherId: publisher.id,
          categoryId: category.id,
          isbn: `978-607-${String(100000 + index).padStart(6, '0')}`,
          description:
            'Material academico disponible para consulta, prestamo y apoyo a cursos escolares o universitarios.',
          type: typeCycle[index % typeCycle.length],
          totalUnits,
          availableUnits: totalUnits,
          coverImage: `/images/covers/cover-${(index % 5) + 1}.svg`,
        })
      )
    }

    const borrowers = users.filter((user) => user.userNumber.startsWith('EST-'))
    const loanStatuses: LoanStatus[] = [
      'ACTIVE',
      'ACTIVE',
      'RENEWED',
      'RETURNED',
      'OVERDUE',
      'ACTIVE',
    ]

    for (let index = 0; index < 30; index++) {
      const book = books[index % books.length]
      const user = borrowers[index % borrowers.length]
      const status = loanStatuses[index % loanStatuses.length]
      const loanDate = DateTime.now().minus({ days: (index % 18) + 2 })
      const dueDate =
        status === 'OVERDUE'
          ? DateTime.now().minus({ days: (index % 7) + 1 })
          : DateTime.now().plus({ days: (index % 13) + 1 })
      const returnedAt = status === 'RETURNED' ? loanDate.plus({ days: 5 }) : null

      await Loan.create({
        userId: user.id,
        bookId: book.id,
        loanDate,
        dueDate,
        returnedAt,
        renewalCount: status === 'RENEWED' ? 1 : 0,
        status,
      })

      if (status !== 'RETURNED') {
        book.availableUnits = Math.max(book.availableUnits - 1, 0)
        await book.save()
      }
    }
  }
}
