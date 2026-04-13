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
OBSERVABILITY_WEBHOOK_URL="https://tu-webhook-de-alertas"
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
- `TURNSTILE_SECRET_KEY` y `NEXT_PUBLIC_TURNSTILE_SITE_KEY` si activas captcha en registro.
- `OBSERVABILITY_WEBHOOK_URL` opcional para recibir alertas de errores runtime y degradacion de salud.

3. Aplica migraciones en produccion:

```bash
npm run db:migrate:deploy
```

4. Build y arranque en modo produccion:

```bash
npm run build
npm run start
```

5. Verifica salud:

```bash
curl -i http://localhost:3000/api/health
```

Si defines `OBSERVABILITY_WEBHOOK_URL`, se enviaran alertas con cooldown desde:

- `POST /api/observability/error` para errores runtime en segmentos privados.
- `GET /api/health` cuando el estado sea `degraded` por latencia o error de DB.

Nota:
En desarrollo local usa `npm run db:migrate` (migrate dev). En produccion usa siempre `npm run db:migrate:deploy`.

## Mantenimiento de rate-limit

Las tablas `AuthRateLimit` y `OpsAlertState` se limpian automaticamente con el workflow programado `Maintenance`.

Requisitos:

- Configurar `DATABASE_URL` como secret de GitHub Actions en el repositorio.

Comandos utiles:

```bash
npm run maintenance:cleanup-rate-limit
```

Variables opcionales del cleanup:

- `AUTH_RATE_LIMIT_RETENTION_DAYS` (por defecto `30`)
- `AUTH_RATE_LIMIT_LOCK_GRACE_HOURS` (por defecto `24`)
- `OPS_ALERT_STATE_RETENTION_DAYS` (por defecto `90`)

## Monitor externo de disponibilidad

El workflow `Uptime Monitor` ejecuta ping externo a health endpoint cada 10 minutos.

Requisitos:

- Configurar `HEALTHCHECK_URL` como secret de GitHub Actions.

Ejemplo recomendado:

- `https://TU_DOMINIO/api/health`

## Prueba de carga minima

Para una validacion rapida de rendimiento en staging:

```bash
npm run test:load:smoke
```

Variables opcionales:

- `LOAD_BASE_URL` (por defecto `http://127.0.0.1:3000`)
- `LOAD_DURATION_SECONDS` (por defecto `30`)
- `LOAD_CONCURRENCY` (por defecto `8`)
- `LOAD_TIMEOUT_MS` (por defecto `8000`)
- `LOAD_MAX_ERROR_RATE_PERCENT` (por defecto `2`)

## Runbook operativo

Existe una guia operativa completa en `docs/produccion-runbook.md` con:

- Despliegue estandar
- Rollback de aplicacion y datos
- Respuesta a incidencias
- Politica de backup y prueba de restauracion

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

## QA automatizada (inicio)

Se ha iniciado la base e2e con Playwright en `tests/e2e/smoke.spec.ts`.

1. Instala navegadores de Playwright (una vez):

```bash
npx playwright install --with-deps chromium
```

2. Ejecuta tests e2e:

```bash
npm run test:e2e
```

Para incluir flujos reales de autenticacion (familia y gestion), activa:

```bash
E2E_AUTH_ENABLED=true \
E2E_FAMILY_IDENTIFIER=familia@kodaore.eus \
E2E_MANAGEMENT_IDENTIFIER=developer \
E2E_PASSWORD=Kodaore2026! \
npm run test:e2e
```

Opcionales:

```bash
npm run test:e2e:headed
npm run test:e2e:ui
```

## Fototeca con assets locales

La fototeca usa imagenes locales definidas en `lib/fototeca.ts` mediante `DEFAULT_FOTOTECA_ITEMS`.

Si quieres cambiar las fotos:

1. Coloca los archivos en `public/media`.
2. Actualiza las rutas `image` y `fallback` en `lib/fototeca.ts`.
3. Reinicia el servidor si estas en produccion.
