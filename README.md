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

## Rutas iniciales

- `http://localhost:3000` redirige a `/eu`
- `http://localhost:3000/eu`
- `http://localhost:3000/es`
- `http://localhost:3000/eu/admin`
- `http://localhost:3000/eu/portal`
- `http://localhost:3000/api/health`

## Credenciales seed

- `developer@kodaore.eus`
- `admin@kodaore.eus`
- `admin.azkoitia@kodaore.eus`
- `admin.azpeitia@kodaore.eus`
- `admin.zumaia@kodaore.eus`

Password: valor de `SEED_DEFAULT_PASSWORD`.

## Siguiente sprint recomendado

- NextAuth con login por rol
- Guardas de permisos en server actions y API
- CRUD completo de alumnos/profesores/grupos
- Importador Excel operativo
- Flujo de remesas con export bancario
