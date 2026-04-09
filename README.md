# Kodaore System

Sistema web de gestion para el club Kodaore con tres sedes: Azkoitia, Azpeitia y Zumaia.

## Estado actual

Base V1 implementada con:

- Modelo de datos multi-sede en Prisma
- Roles y permisos por sede
- Semilla inicial con usuarios, sedes y datos demo
- Home bilingue (eu/es)
- Panel admin inicial con metricas
- Endpoint de salud en API

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## Configuracion

1. Instala dependencias:

```bash
npm install
```

2. Crea el archivo `.env` con la cadena de conexion:

```bash
DATABASE_URL="postgresql://usuario:password@localhost:5432/kodaore"
SEED_DEFAULT_PASSWORD="Kodaore2026!"
NEXTAUTH_SECRET="genera-un-secreto-largo-y-aleatorio"
NEXTAUTH_URL="http://localhost:3000"
```

3. Genera cliente y aplica migracion:

```bash
npm run db:generate
npm run db:migrate -- --name init_kodaore_v1
```

4. Carga datos base:

```bash
npm run db:seed
```

5. Arranca el proyecto:

```bash
npm run dev
```

## Preparacion para produccion

1. Crea variables de entorno de produccion:

```bash
cp .env.production.example .env.production
```

2. Ajusta en `.env.production`:

- `DATABASE_URL` apuntando a tu Postgres real.
- `NEXTAUTH_SECRET` con un secreto aleatorio de al menos 32 caracteres.
- `NEXTAUTH_URL` con la URL publica final (https).

3. Build y arranque en modo produccion:

```bash
npm run build
npm run start
```

4. Verifica salud:

```bash
curl -i http://localhost:3000/api/health
```

## Rutas iniciales

- `http://localhost:3000` redirige a `/eu`
- `http://localhost:3000/eu`
- `http://localhost:3000/es`
- `http://localhost:3000/eu/acceso`
- `http://localhost:3000/eu/admin`
- `http://localhost:3000/eu/portal`
- `http://localhost:3000/api/health`

## Credenciales seed

Gestion (login por usuario):

- `developer`
- `admin.global`
- `admin.azkoitia`
- `admin.azpeitia`
- `admin.zumaia`
- `profe.azkoitia`
- `profe.azpeitia`
- `profe.zumaia`
- `operador.azkoitia`
- `operador.azpeitia`
- `operador.zumaia`

Familias (login por email):

- `familia@kodaore.eus`

Password: valor de `SEED_DEFAULT_PASSWORD`.

Acceso real:

- Login en `/eu/acceso` o `/es/acceso`
- `/[locale]/admin` requiere rol de administracion
- `/[locale]/portal` requiere sesion iniciada

## Siguiente sprint recomendado

- Guardas de permisos en server actions y API
- CRUD completo de alumnos/profesores/grupos
- Importador Excel operativo
- Flujo de remesas con export bancario
