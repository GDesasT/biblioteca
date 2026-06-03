# Biblioteca Local

Aplicacion web local para administrar una biblioteca escolar o universitaria.

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
- Renovaciones con maximo de 2 y extension de 7 dias.
- Sincronizacion de prestamos vencidos a `OVERDUE`.
- Dashboard con totales, prestamos activos/vencidos, libros mas prestados y categorias populares.
- Panel de estudiante con prestamos activos, dias restantes, renovaciones, historial y recomendaciones locales.
- Recomendaciones locales basadas en historial, categorias y autores.

## Verificacion

Comandos usados durante el desarrollo:

```bash
npm run typecheck
npm run build
```

Nota: `node ace migration:run` requiere que MySQL este activo. Si ves `ECONNREFUSED 127.0.0.1:3306`, inicia MySQL y confirma que la base `library_system` exista.
