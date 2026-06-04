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

type CatalogBook = {
  title: string
  author: string
  isbn: string
  coverImage: string
}

const catalogBooks: CatalogBook[] = [
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '9782326002272',
    coverImage: 'https://covers.openlibrary.org/b/id/8065615-L.jpg',
  },
  {
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '9780072970548',
    coverImage: 'https://covers.openlibrary.org/b/id/2341462-L.jpg',
  },
  {
    title: 'Design Patterns',
    author: 'Erich Gamma',
    isbn: '9789043002172',
    coverImage: 'https://covers.openlibrary.org/b/id/6601119-L.jpg',
  },
  {
    title: 'JavaScript: The Good Parts',
    author: 'Douglas Crockford',
    isbn: '9780596153830',
    coverImage: 'https://covers.openlibrary.org/b/id/9245523-L.jpg',
  },
  {
    title: 'Code Complete',
    author: 'Steve McConnell',
    isbn: '9780735635074',
    coverImage: 'https://covers.openlibrary.org/b/id/461500-L.jpg',
  },
  {
    title: 'Calculus',
    author: 'James Stewart',
    isbn: '9780840054104',
    coverImage: 'https://covers.openlibrary.org/b/id/364094-L.jpg',
  },
  {
    title: 'Introduction to Linear Algebra',
    author: 'Gilbert Strang',
    isbn: '9780980232776',
    coverImage: 'https://covers.openlibrary.org/b/id/725050-L.jpg',
  },
  {
    title: 'Discrete Mathematics and Its Applications',
    author: 'Kenneth H. Rosen',
    isbn: '9780072899054',
    coverImage: 'https://covers.openlibrary.org/b/id/7083171-L.jpg',
  },
  {
    title: 'Statistics',
    author: 'David Freedman',
    isbn: '9780393090765',
    coverImage: 'https://covers.openlibrary.org/b/id/252677-L.jpg',
  },
  {
    title: 'A First Course in Probability',
    author: 'Sheldon M. Ross',
    isbn: '9780024038807',
    coverImage: 'https://covers.openlibrary.org/b/id/88605-L.jpg',
  },
  {
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    isbn: '9782226479822',
    coverImage: 'https://covers.openlibrary.org/b/id/8634250-L.jpg',
  },
  {
    title: 'Guns, Germs, and Steel',
    author: 'Jared M. Diamond',
    isbn: '9785271451942',
    coverImage: 'https://covers.openlibrary.org/b/id/7884018-L.jpg',
  },
  {
    title: "A People's History of the United States",
    author: 'Howard Zinn',
    isbn: '9781565843790',
    coverImage: 'https://covers.openlibrary.org/b/id/10592817-L.jpg',
  },
  {
    title: 'India after Gandhi',
    author: 'Ramachandra Guha',
    isbn: '9780060198817',
    coverImage: 'https://covers.openlibrary.org/b/id/6821235-L.jpg',
  },
  {
    title: 'Postwar',
    author: 'Tony Judt',
    isbn: '9789655174939',
    coverImage: 'https://covers.openlibrary.org/b/id/111385-L.jpg',
  },
  {
    title: 'Cien anos de soledad',
    author: 'Gabriel Garcia Marquez',
    isbn: '9788467200669',
    coverImage: 'https://covers.openlibrary.org/b/id/12627383-L.jpg',
  },
  {
    title: 'Don Quijote de la Mancha',
    author: 'Miguel de Cervantes Saavedra',
    isbn: '9781549686429',
    coverImage: 'https://covers.openlibrary.org/b/id/14428305-L.jpg',
  },
  {
    title: 'La casa de los espiritus',
    author: 'Isabel Allende',
    isbn: '9786070763144',
    coverImage: 'https://covers.openlibrary.org/b/id/3205226-L.jpg',
  },
  {
    title: 'Ficciones',
    author: 'Jorge Luis Borges',
    isbn: '9780802190734',
    coverImage: 'https://covers.openlibrary.org/b/id/10832290-L.jpg',
  },
  {
    title: 'Pedro Paramo',
    author: 'Juan Rulfo',
    isbn: '9798657168310',
    coverImage: 'https://covers.openlibrary.org/b/id/5419076-L.jpg',
  },
  {
    title: 'Campbell Biology',
    author: 'Lisa A. Urry',
    isbn: '9780135188743',
    coverImage: 'https://covers.openlibrary.org/b/id/14421251-L.jpg',
  },
  {
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    isbn: '9782277233619',
    coverImage: 'https://covers.openlibrary.org/b/id/10432365-L.jpg',
  },
  {
    title: 'Cosmos',
    author: 'Carl Sagan',
    isbn: '9780345331359',
    coverImage: 'https://covers.openlibrary.org/b/id/8283901-L.jpg',
  },
  {
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    isbn: '9780387086491',
    coverImage: 'https://covers.openlibrary.org/b/id/133936-L.jpg',
  },
  {
    title: 'On the Origin of Species',
    author: 'Charles Darwin',
    isbn: '9780679749554',
    coverImage: 'https://covers.openlibrary.org/b/id/7153600-L.jpg',
  },
  {
    title: 'Engineering Mechanics',
    author: 'R. C. Hibbeler',
    isbn: '9780023542503',
    coverImage: 'https://covers.openlibrary.org/b/id/6601657-L.jpg',
  },
  {
    title: 'Fundamentals of Electric Circuits',
    author: 'Charles K. Alexander',
    isbn: '9780072463316',
    coverImage: 'https://covers.openlibrary.org/b/id/4263144-L.jpg',
  },
  {
    title: 'Digital Design',
    author: 'M. Morris Mano',
    isbn: '9780130355256',
    coverImage: 'https://covers.openlibrary.org/b/id/10649545-L.jpg',
  },
  {
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum',
    isbn: '9780131668362',
    coverImage: 'https://covers.openlibrary.org/b/id/9378629-L.jpg',
  },
  {
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz',
    isbn: '9780072283631',
    coverImage: 'https://covers.openlibrary.org/b/id/54871-L.jpg',
  },
  {
    title: 'Good to Great',
    author: 'Jim Collins',
    isbn: '9780694526079',
    coverImage: 'https://covers.openlibrary.org/b/id/53111-L.jpg',
  },
  {
    title: 'The Lean Startup',
    author: 'Eric Ries',
    isbn: '9780670921621',
    coverImage: 'https://covers.openlibrary.org/b/id/7104760-L.jpg',
  },
  {
    title: 'Principles of Management',
    author: 'George Robert Terry',
    isbn: '9780256026405',
    coverImage: 'https://covers.openlibrary.org/b/id/4450295-L.jpg',
  },
  {
    title: 'Competitive Strategy',
    author: 'Michael E. Porter',
    isbn: '9780684841489',
    coverImage: 'https://covers.openlibrary.org/b/id/19091-L.jpg',
  },
  {
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    isbn: '9787508633558',
    coverImage: 'https://covers.openlibrary.org/b/id/13290711-L.jpg',
  },
  {
    title: 'The Story of Art',
    author: 'E. H. Gombrich',
    isbn: '9780714822761',
    coverImage: 'https://covers.openlibrary.org/b/id/538390-L.jpg',
  },
  {
    title: 'Ways of Seeing',
    author: 'John Berger',
    isbn: '9780563122449',
    coverImage: 'https://covers.openlibrary.org/b/id/95272-L.jpg',
  },
  {
    title: 'History of Art',
    author: 'H. W. Janson',
    isbn: '9780133893885',
    coverImage: 'https://covers.openlibrary.org/b/id/10075231-L.jpg',
  },
  {
    title: 'Interaction of Color',
    author: 'Joseph Albers',
    isbn: '9780300146936',
    coverImage: 'https://covers.openlibrary.org/b/id/13011097-L.jpg',
  },
  {
    title: 'The Design of Everyday Things',
    author: 'Donald A. Norman',
    isbn: '9780465067091',
    coverImage: 'https://covers.openlibrary.org/b/id/10007224-L.jpg',
  },
  {
    title: 'English Grammar in Use',
    author: 'Raymond Murphy',
    isbn: '9780521189392',
    coverImage: 'https://covers.openlibrary.org/b/id/8454904-L.jpg',
  },
  {
    title: 'Word Power Made Easy',
    author: 'Norman Lewis',
    isbn: '9780883659250',
    coverImage: 'https://covers.openlibrary.org/b/id/9082714-L.jpg',
  },
  {
    title: 'Practical English Usage',
    author: 'Michael Swan',
    isbn: '9780194311861',
    coverImage: 'https://covers.openlibrary.org/b/id/5295458-L.jpg',
  },
  {
    title: 'The Elements of Style',
    author: 'William Strunk Jr.',
    isbn: '9798478451134',
    coverImage: 'https://covers.openlibrary.org/b/id/10515358-L.jpg',
  },
  {
    title: 'Practical Spanish Grammar',
    author: 'Marcial Prado',
    isbn: '9780471134466',
    coverImage: 'https://covers.openlibrary.org/b/id/4278950-L.jpg',
  },
  {
    title: 'Psychology',
    author: 'David G. Myers',
    isbn: '9780879013110',
    coverImage: 'https://covers.openlibrary.org/b/id/6601727-L.jpg',
  },
  {
    title: "Man's Search for Meaning",
    author: 'Viktor E. Frankl',
    isbn: '9788171086382',
    coverImage: 'https://covers.openlibrary.org/b/id/8516506-L.jpg',
  },
  {
    title: 'Emotional Intelligence',
    author: 'Daniel Goleman',
    isbn: '9781559276429',
    coverImage: 'https://covers.openlibrary.org/b/id/1359485-L.jpg',
  },
  {
    title: 'The Social Animal',
    author: 'Elliot Aronson',
    isbn: '9780716712299',
    coverImage: 'https://covers.openlibrary.org/b/id/3881631-L.jpg',
  },
  {
    title: 'Flow',
    author: 'Mihaly Csikszentmihalyi',
    isbn: '9780965019606',
    coverImage: 'https://covers.openlibrary.org/b/id/11041932-L.jpg',
  },
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
    for (let index = 0; index < catalogBooks.length; index++) {
      const catalogBook = catalogBooks[index]
      const category = createdCategories[Math.floor(index / 5) % createdCategories.length]
      const publisher = createdPublishers[index % createdPublishers.length]
      const totalUnits = (index % 6) + 2

      books.push(
        await Book.create({
          title: catalogBook.title,
          author: catalogBook.author,
          publisherId: publisher.id,
          categoryId: category.id,
          isbn: catalogBook.isbn,
          description:
            'Material academico disponible para consulta, prestamo y apoyo a cursos escolares o universitarios.',
          type: typeCycle[index % typeCycle.length],
          totalUnits,
          availableUnits: totalUnits,
          coverImage: catalogBook.coverImage,
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
