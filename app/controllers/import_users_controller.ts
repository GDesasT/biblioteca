import type { HttpContext } from '@adonisjs/core/http'

const sampleRows = [
  {
    userNumber: '23170051',
    fullName: 'Juan Gerardo Alcantar Torres',
    email: '23170051@utt.edu.mx',
    role: 'Alumno',
    program: 'TSU Desarrollo de Software',
    group: '7A',
    password: 'UTT-23170051',
    status: 'Listo',
  },
  {
    userNumber: '23170052',
    fullName: 'Mariana Torres Ruiz',
    email: '23170052@utt.edu.mx',
    role: 'Alumno',
    program: 'TSU Mecatronica',
    group: '7B',
    password: 'UTT-23170052',
    status: 'Listo',
  },
  {
    userNumber: 'DOC-0041',
    fullName: 'Carlos Herrera Diaz',
    email: 'carlos.herrera@utt.edu.mx',
    role: 'Docente',
    program: 'Ingenieria Industrial',
    group: 'N/A',
    password: 'UTT-DOC0041',
    status: 'Listo',
  },
  {
    userNumber: '23170088',
    fullName: 'Sofia Castillo Vega',
    email: '23170088@utt.edu.mx',
    role: 'Alumno',
    program: 'TSU Administracion',
    group: '5C',
    password: 'UTT-23170088',
    status: 'Duplicado',
  },
]

export default class ImportUsersController {
  async index({ view }: HttpContext) {
    return view.render('imports/users', { sampleRows })
  }
}
