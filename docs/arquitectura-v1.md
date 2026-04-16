# Kodaore arquitectura V1

## Objetivo

Sistema unico para Azkoitia, Azpeitia y Zumaia, con experiencia publica bilingue, panel de gestion y portal familiar bajo un mismo backend.

## Stack

- Next.js 16 (App Router)
- TypeScript (strict)
- Prisma + PostgreSQL
- Tailwind CSS v4
- NextAuth v4 (credentials)
- Playwright + Vitest

## Capas actuales

### Capa web

- Segmento localizado `app/[locale]` para `eu/es`
- Home y secciones publicas: sedes, fototeca y erropak
- Segmentos privados:
  - `app/[locale]/admin/*`
  - `app/[locale]/portal/*`

### Capa API

- `app/api/auth/[...nextauth]`: sesion y autenticacion
- `app/api/auth/register`: alta de familia
- `app/api/health`: healthcheck y degradacion
- `app/api/observability/error`: ingest de errores cliente

### Capa dominio y datos

- `lib/auth.ts`: authOptions, guardas, reglas de login por tipo de usuario
- `lib/admin.ts` y `lib/portal.ts`: lectura de datos para panel y portal
- `lib/security/rate-limit.ts`: utilidades de rate-limit
- `lib/alerting.ts` y `lib/observability.ts`: alertas y reporte de errores
- `lib/env-validation.ts`: validacion estricta de entorno

### Persistencia

- Prisma schema multi-sede con roles, permisos, alumnado, grupos, cobros y comunicaciones
- Seed funcional en `prisma/seed.mjs` con usuarios de gestion y familia demo

## Modelo de acceso

- Gestion inicia sesion por `username`
- Familias inician sesion por `email`
- Guardas de acceso por rol con `requireAuth`
- Matriz de permisos declarada en `lib/domain/security.ts`

## Seguridad implementada

- Headers de seguridad globales en `next.config.ts`
- Rate-limit en login, registro y observabilidad
- Validacion de payloads con Zod en endpoints sensibles
- Validacion fuerte de variables de entorno

## Observabilidad y operaciones

- Health endpoint con estados `ok/degraded`
- Envio opcional de alertas via webhook
- Limpieza periodica de tablas de rate-limit/alert-state

## QA automatizada

- Lint
- Unit tests para utilidades criticas
- Build de produccion en CI
- Smoke e2e con rutas publicas y privadas

## Proximos incrementos recomendados

- Filtros por sede en consultas de administracion para roles de sede
- Mayor cobertura de tests de integracion en APIs de auth y observabilidad
- Activar auditoria funcional para operaciones de negocio (no solo seed)
- Endurecer politica de contrasenas y trazabilidad por request id
