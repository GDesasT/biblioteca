# Biblioteca Coyote UTT

Aplicacion web local para administrar la biblioteca de la Universidad Tecnologica de Torreon.

Stack:

- Node.js
- AdonisJS 6
- TypeScript
- Edge Templates
- TailwindCSS
- Alpine.js
- MySQL local
- Lucid ORM
- Autenticacion local con sesiones

No usa Firebase, Supabase, AWS, APIs externas ni servicios cloud.

## Requisitos

- Node.js 20.6 o superior
- MySQL local activo en `127.0.0.1:3306`
- Base de datos local creada:

```sql
CREATE DATABASE IF NOT EXISTS library_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

## Instalacion

```bash
npm install
cp .env.example .env
node ace migration:run
node ace db:seed
npm run dev
```

En Windows PowerShell, si no tienes `cp`:

```powershell
Copy-Item .env.example .env
```

URL local:

```text
http://localhost:3333
```

## Variables MySQL

`.env.example` ya viene preparado con:

```env
DB_CONNECTION=mysql
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DB_NAME=library_system
```

## Usuarios de prueba

Todos usan `password123`.

| Rol | Email |
| --- | --- |
| Administrador | admin@biblioteca.local |
| Empleado | empleado1@biblioteca.local |
| Estudiante | estudiante1@biblioteca.local |

## Funcionalidades

- Login con email/password, hash de contrasenas y sesiones locales.
- Middleware de autenticacion y roles.
- CRUD de usuarios, libros, editoriales, categorias y prestamos.
- Inventario con unidades totales, disponibles y prestadas.
- Bloqueo de prestamos sin stock.
- Devoluciones que incrementan inventario.
- Renovaciones con maximo de 1 y extension de 7 dias.
- Sincronizacion de prestamos vencidos a `OVERDUE`.
- Dashboard con totales, prestamos activos/vencidos, libros mas prestados y categorias populares.
- Panel de estudiante con prestamos activos, dias restantes, renovaciones, historial y recomendaciones locales.
- Recomendaciones locales basadas en historial, categorias y autores.

## Division para exposicion

La presentacion se puede dividir entre 5 personas para que cada una explique una parte clara del sistema.

### 1. Mario - Introduccion, objetivo y stack del proyecto

Mario puede abrir la exposicion explicando que el proyecto es una aplicacion web local para administrar una biblioteca escolar o universitaria.

Puntos a explicar:

- Problema que resuelve: organizar libros, usuarios, prestamos, devoluciones e inventario.
- Stack usado: Node.js, AdonisJS 6, TypeScript, Edge Templates, TailwindCSS, Alpine.js, MySQL y Lucid ORM.
- Por que es local: no depende de Firebase, Supabase, AWS ni APIs externas.
- Flujo general del sistema: el usuario inicia sesion, entra segun su rol y usa los modulos permitidos.
- Archivos que puede mencionar:
  - `package.json`: dependencias y scripts del proyecto.
  - `config/database.ts`: conexion a MySQL.
  - `start/routes.ts`: rutas principales del sistema.

Mini guion:

> "Nuestro sistema se llama Biblioteca Coyote UTT. Sirve para administrar una biblioteca desde una aplicacion web, permitiendo controlar libros, usuarios, prestamos, devoluciones, inventario y reportes. Esta construido con AdonisJS, TypeScript y MySQL, y funciona de forma local sin servicios externos."

### 2. Victor - Autenticacion, roles y seguridad

Victor puede explicar como el sistema controla el acceso de los usuarios.

Puntos a explicar:

- Login con email y contrasena.
- Contrasenas protegidas con hash.
- Uso de sesiones locales para mantener al usuario autenticado.
- Roles del sistema:
  - Administrador.
  - Empleado.
  - Estudiante.
- Middleware de autenticacion: evita entrar a modulos sin iniciar sesion.
- Middleware de roles: limita acciones segun permisos.
- Ejemplo de permisos:
  - Administrador: usuarios, categorias, editoriales, reportes y eliminacion de prestamos.
  - Empleado: libros, prestamos, inventario y consulta de usuarios.
  - Estudiante: panel personal, historial, renovaciones y recomendaciones.
- Archivos que puede mencionar:
  - `app/controllers/session_controller.ts`
  - `app/middleware/auth_middleware.ts`
  - `app/middleware/role_middleware.ts`
  - `config/auth.ts`
  - `start/routes.ts`

Mini guion:

> "La seguridad se basa en autenticacion por sesiones y control de roles. Primero el usuario inicia sesion, despues el sistema revisa su rol y solo le muestra o permite acceder a las secciones que le corresponden."

### 3. Jose Luis - Base de datos, modelos y catalogos

Jose Luis puede explicar la estructura de datos del sistema.

Puntos a explicar:

- Base de datos local en MySQL llamada `library_system`.
- Uso de migraciones para crear tablas.
- Modelos principales:
  - `User`: usuarios del sistema.
  - `Role`: permisos o tipo de usuario.
  - `Book`: libros disponibles.
  - `Category`: categorias.
  - `Publisher`: editoriales.
  - `Loan`: prestamos.
- Relaciones importantes:
  - Un usuario tiene un rol.
  - Un libro pertenece a una categoria y a una editorial.
  - Un prestamo relaciona un usuario con un libro.
- Datos iniciales cargados por el seeder:
  - Roles.
  - Usuarios de prueba.
  - Categorias.
  - Editoriales.
  - Libros.
  - Prestamos de ejemplo.
- Archivos que puede mencionar:
  - `database/migrations/*`
  - `database/seeders/main_seeder.ts`
  - `app/models/user.ts`
  - `app/models/book.ts`
  - `app/models/loan.ts`

Mini guion:

> "La informacion se guarda en MySQL usando Lucid ORM. Las migraciones definen las tablas y los modelos representan cada entidad del sistema. La tabla de prestamos es clave porque conecta a los estudiantes con los libros y permite calcular inventario, historial y reportes."

### 4. Santi - Modulos administrativos: libros, usuarios, categorias, editoriales e inventario

Santi puede explicar la parte operativa que usan administradores y empleados.

Puntos a explicar:

- CRUD de libros:
  - Crear, listar, editar y eliminar libros.
  - Datos como titulo, autor, ISBN, tipo, categoria, editorial, unidades totales y disponibles.
- CRUD de usuarios:
  - Alta de administradores, empleados y estudiantes.
- CRUD de categorias y editoriales:
  - Sirven para clasificar y organizar los libros.
- Inventario:
  - Muestra unidades totales, disponibles y prestadas.
  - Evita que las unidades disponibles sean mayores que las unidades totales.
  - Permite recalcular disponibilidad con base en prestamos activos.
- Validaciones:
  - Evitan guardar datos incompletos o incorrectos.
- Archivos que puede mencionar:
  - `app/controllers/books_controller.ts`
  - `app/controllers/users_controller.ts`
  - `app/controllers/categories_controller.ts`
  - `app/controllers/publishers_controller.ts`
  - `app/controllers/inventory_controller.ts`
  - `app/services/inventory_service.ts`
  - `app/validators/*`

Mini guion:

> "Esta parte es la administracion diaria de la biblioteca. Desde aqui se registran libros, usuarios, categorias y editoriales. Tambien se controla el inventario para saber cuantas unidades existen, cuantas estan disponibles y cuantas estan prestadas."

### 5. Gerardo - Prestamos, devoluciones, dashboard, reportes y panel del estudiante

Gerardo puede cerrar explicando la logica principal del sistema y la experiencia del usuario final.

Puntos a explicar:

- Prestamos:
  - Un empleado o administrador registra el prestamo de un libro a un estudiante.
  - El sistema bloquea prestamos si no hay unidades disponibles.
  - Al prestar, baja el inventario disponible.
- Devoluciones:
  - Cambian el estado del prestamo a `RETURNED`.
  - Incrementan las unidades disponibles del libro.
- Renovaciones:
  - Maximo 1 renovacion por prestamo.
  - Cada renovacion agrega 7 dias.
  - No se pueden renovar prestamos vencidos o devueltos.
- Prestamos vencidos:
  - El sistema sincroniza automaticamente prestamos atrasados a `OVERDUE`.
- Dashboard:
  - Totales de libros, usuarios, unidades, prestamos activos y vencidos.
  - Libros mas prestados.
  - Categorias populares.
- Reportes:
  - Prestamos por mes.
  - Top de libros.
  - Categorias mas solicitadas.
  - Usuarios con prestamos vencidos.
- Panel del estudiante:
  - Prestamos activos.
  - Dias restantes.
  - Historial.
  - Renovaciones.
  - Recomendaciones basadas en historial, categorias y autores.
- Archivos que puede mencionar:
  - `app/services/loan_service.ts`
  - `app/services/recommendation_service.ts`
  - `app/controllers/loans_controller.ts`
  - `app/controllers/dashboard_controller.ts`
  - `app/controllers/reports_controller.ts`
  - `app/controllers/student_controller.ts`

Mini guion:

> "La logica central esta en los prestamos. Cuando se presta un libro, el sistema valida stock y descuenta una unidad. Cuando se devuelve, regresa esa unidad al inventario. Tambien controla renovaciones, vencimientos, reportes y recomendaciones para estudiantes."

## Orden sugerido para presentar

1. Mario: contexto general, objetivo, stack y arquitectura.
2. Victor: login, sesiones, roles y permisos.
3. Jose Luis: base de datos, modelos, relaciones y datos iniciales.
4. Santi: modulos CRUD e inventario.
5. Gerardo: prestamos, devoluciones, reportes, dashboard y panel del estudiante.

## Demo sugerida

1. Entrar a `http://localhost:3333`.
2. Iniciar sesion como administrador con `admin@biblioteca.local` y `password123`.
3. Mostrar dashboard.
4. Crear o editar un libro.
5. Revisar inventario.
6. Registrar un prestamo.
7. Renovar o devolver un prestamo.
8. Mostrar reportes.
9. Cerrar sesion e iniciar como estudiante con `estudiante1@biblioteca.local`.
10. Mostrar panel del estudiante, historial y recomendaciones.

## Verificacion

Comandos usados durante el desarrollo:

```bash
npm run typecheck
npm run build
```

Nota: `node ace migration:run` requiere que MySQL este activo. Si ves `ECONNREFUSED 127.0.0.1:3306`, inicia MySQL y confirma que la base `library_system` exista.
