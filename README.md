# Kodaore System

Sistema web del club Kodaore para gestion administrativa y portal de familias, con tres sedes: Azkoitia, Azpeitia y Zumaia.

## Estado actual

Version activa con:

- App Router con localizacion `eu/es`
- NextAuth (credenciales) con login por usuario para gestion y por email para familias
- Registro de cuentas de familia con rate-limit y soporte opcional de Turnstile
- Backoffice (`/[locale]/admin`) con modulos de alumnos, grupos y cobros
- Portal familiar (`/[locale]/portal`) con resumen, perfil, pagos y comunicaciones
- Observabilidad basica (`/api/health` y `/api/observability/error`)
- Prisma + PostgreSQL con seed operativo
- Suite de QA: lint, unit tests, build y smoke e2e

## Requisitos

- Node.js 20+
- PostgreSQL 14+

## Configuracion local

1. Instala dependencias:

```bash
npm install
```

2. Crea `.env` con valores minimos:

```bash
DATABASE_URL="postgresql://usuario:password@localhost:5432/kodaore"
NEXTAUTH_SECRET="genera-un-secreto-largo-y-aleatorio-min-32"
NEXTAUTH_URL="http://localhost:3000"
SEED_DEFAULT_PASSWORD="Kodaore2026!"
OBSERVABILITY_WEBHOOK_URL="https://tu-webhook-opcional"
```

3. Genera cliente y aplica migraciones de desarrollo:

```bash
npm run db:generate
npm run db:migrate -- --name init
```

4. Carga datos demo:

```bash
npm run db:seed
```

5. Arranca la app:

```bash
npm run dev
```

## Produccion

1. Prepara entorno:

```bash
cp .env.production.example .env.production
```

2. Variables clave:

- `DATABASE_URL`
- `NEXTAUTH_SECRET` (>= 32 chars)
- `NEXTAUTH_URL` (https publica)
- `TURNSTILE_SECRET_KEY` y `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (deben ir juntas)
- `OBSERVABILITY_WEBHOOK_URL` (opcional)

3. Migra base de datos:

```bash
npm run db:migrate:deploy
```

4. Build + start:

```bash
npm run build
npm run start
```

5. Verifica salud:

```bash
curl -i https://TU_DOMINIO/api/health
```

## Operacion

### Limpieza programada

Workflow `Maintenance` limpia `AuthRateLimit` y `OpsAlertState`.

Comando manual:

```bash
npm run maintenance:cleanup-rate-limit
```

Variables opcionales:

- `AUTH_RATE_LIMIT_RETENTION_DAYS` (default: `30`)
- `AUTH_RATE_LIMIT_LOCK_GRACE_HOURS` (default: `24`)
- `OPS_ALERT_STATE_RETENTION_DAYS` (default: `90`)

### Monitor externo

Workflow `Uptime Monitor` consulta `HEALTHCHECK_URL` cada 10 minutos.

Ejemplo:

- `https://TU_DOMINIO/api/health`

### Prueba de carga minima

```bash
npm run test:load:smoke
```

Variables opcionales:

- `LOAD_BASE_URL` (default: `http://127.0.0.1:3000`)
- `LOAD_DURATION_SECONDS` (default: `30`)
- `LOAD_CONCURRENCY` (default: `8`)
- `LOAD_TIMEOUT_MS` (default: `8000`)
- `LOAD_MAX_ERROR_RATE_PERCENT` (default: `2`)

## QA

```bash
npm run lint
npm run test:unit
npm run build
npm run test:e2e
```

Para e2e con login real:

```bash
E2E_AUTH_ENABLED=true \
E2E_FAMILY_IDENTIFIER=familia@kodaore.eus \
E2E_MANAGEMENT_IDENTIFIER=developer \
E2E_PASSWORD=Kodaore2026! \
npm run test:e2e
```

## Rutas principales

- `/` redirige a `/eu`
- `/[locale]`
- `/[locale]/acceso`
- `/[locale]/acceso/crear-cuenta`
- `/[locale]/admin`
- `/[locale]/admin/students`
- `/[locale]/admin/groups`
- `/[locale]/admin/billing`
- `/[locale]/portal`
- `/[locale]/portal/profile`
- `/[locale]/portal/payments`
- `/[locale]/portal/messages`
- `/api/health`
- `/api/auth/register`

## Credenciales de seed

Gestion (usuario):

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

Familia (email):

- `familia@kodaore.eus`

Password seed: valor de `SEED_DEFAULT_PASSWORD`.

## Documentacion adicional

- Arquitectura: `docs/arquitectura-v1.md`
- Reorganizacion propuesta (App Router V2): `docs/arquitectura-v2-reorganizacion-app-router.md`
- Operacion: `docs/produccion-runbook.md`
