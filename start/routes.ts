import BooksController from '#controllers/books_controller'
import CategoriesController from '#controllers/categories_controller'
import DashboardController from '#controllers/dashboard_controller'
import HomeController from '#controllers/home_controller'
import ImportUsersController from '#controllers/import_users_controller'
import InventoryController from '#controllers/inventory_controller'
import LoansController from '#controllers/loans_controller'
import ProfileController from '#controllers/profile_controller'
import PublishersController from '#controllers/publishers_controller'
import ReportsController from '#controllers/reports_controller'
import SessionController from '#controllers/session_controller'
import StudentController from '#controllers/student_controller'
import UsersController from '#controllers/users_controller'
import type { RoleName } from '#models/role'
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const admin: RoleName[] = ['Administrador']
const staff: RoleName[] = ['Administrador', 'Empleado']
const students: RoleName[] = ['Estudiante']

router.get('/', [HomeController, 'index']).as('home')

router
  .group(() => {
    router.get('/login', [SessionController, 'create']).as('login')
    router.post('/login', [SessionController, 'store']).as('login.store')
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('/logout', [SessionController, 'destroy']).as('logout')

    router.get('/profile', [ProfileController, 'edit']).as('profile.edit')
    router.put('/profile', [ProfileController, 'update']).as('profile.update')
    router.put('/profile/password', [ProfileController, 'updatePassword']).as('profile.password')

    router.get('/dashboard', [DashboardController, 'index']).as('dashboard')

    router.get('/books', [BooksController, 'index']).as('books.index')
    router
      .group(() => {
        router.get('/books/create', [BooksController, 'create']).as('books.create')
        router.post('/books', [BooksController, 'store']).as('books.store')
        router.get('/books/:id/edit', [BooksController, 'edit']).as('books.edit')
        router.put('/books/:id', [BooksController, 'update']).as('books.update')
        router.delete('/books/:id', [BooksController, 'destroy']).as('books.destroy')
      })
      .use(middleware.role(staff))

    router.get('/inventory', [InventoryController, 'index']).as('inventory.index').use(middleware.role(staff))

    router
      .group(() => {
        router.get('/users', [UsersController, 'index']).as('users.index')
      })
      .use(middleware.role(staff))

    router
      .group(() => {
        router.get('/users/create', [UsersController, 'create']).as('users.create')
        router.post('/users', [UsersController, 'store']).as('users.store')
        router.get('/users/:id/edit', [UsersController, 'edit']).as('users.edit')
        router.put('/users/:id', [UsersController, 'update']).as('users.update')
        router.delete('/users/:id', [UsersController, 'destroy']).as('users.destroy')

        router.get('/publishers', [PublishersController, 'index']).as('publishers.index')
        router.get('/publishers/create', [PublishersController, 'create']).as('publishers.create')
        router.post('/publishers', [PublishersController, 'store']).as('publishers.store')
        router.get('/publishers/:id/edit', [PublishersController, 'edit']).as('publishers.edit')
        router.put('/publishers/:id', [PublishersController, 'update']).as('publishers.update')
        router.delete('/publishers/:id', [PublishersController, 'destroy']).as('publishers.destroy')

        router.get('/categories', [CategoriesController, 'index']).as('categories.index')
        router.get('/categories/create', [CategoriesController, 'create']).as('categories.create')
        router.post('/categories', [CategoriesController, 'store']).as('categories.store')
        router.get('/categories/:id/edit', [CategoriesController, 'edit']).as('categories.edit')
        router.put('/categories/:id', [CategoriesController, 'update']).as('categories.update')
        router.delete('/categories/:id', [CategoriesController, 'destroy']).as('categories.destroy')

        router.get('/imports/users', [ImportUsersController, 'index']).as('imports.users')
        router.get('/reports', [ReportsController, 'index']).as('reports.index')
      })
      .use(middleware.role(admin))

    router
      .group(() => {
        router.get('/loans', [LoansController, 'index']).as('loans.index')
        router.get('/loans/create', [LoansController, 'create']).as('loans.create')
        router.post('/loans', [LoansController, 'store']).as('loans.store')
        router.get('/loans/:id/edit', [LoansController, 'edit']).as('loans.edit')
        router.put('/loans/:id', [LoansController, 'update']).as('loans.update')
        router.post('/loans/:id/return', [LoansController, 'returnLoan']).as('loans.return')
        router.post('/loans/:id/renew', [LoansController, 'renew']).as('loans.renew')
      })
      .use(middleware.role(staff))

    router.delete('/loans/:id', [LoansController, 'destroy']).as('loans.destroy').use(middleware.role(admin))

    router
      .group(() => {
        router.get('/student', [StudentController, 'index']).as('student.index')
        router.get('/student/history', [StudentController, 'history']).as('student.history')
        router
          .get('/student/recommendations', [StudentController, 'recommendations'])
          .as('student.recommendations')
        router.post('/student/books/:id/request', [StudentController, 'requestLoan']).as('student.request')
        router.post('/student/loans/:id/renew', [StudentController, 'renew']).as('student.renew')
      })
      .use(middleware.role(students))
  })
  .use(middleware.auth())
