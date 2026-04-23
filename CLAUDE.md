@AGENTS.md
# Kodaore System

Web del club Kodaore (sedes: Azkoitia, Azpeitia, Zumaia).
Backoffice de gestión + portal de familias.

## Stack
- Next.js 15 (App Router) + React 19 + TS 5
- Tailwind 4, NextAuth 4, Prisma 6 + PostgreSQL
- react-hook-form + zod, nodemailer, three.js + vanta
- PM2 (ecosystem.config.js)

## Estructura
- `app/[locale]/` — rutas eu/es (admin, portal, acceso, api)
- `components/` — UI por dominio
- `lib/` — auth, prisma, i18n, mail, portal, dashboard, admin,
  observability, alerting, audit, env-validation, security, domain
- `prisma/` — schema + migraciones + seed
- `tests/` — Playwright (e2e) y `tests/unit` (Vitest)
- `docs/` — arquitectura, runbook, i18n inventory

## Reglas no negociables
- **Nunca** tocar sin pedir permiso: `prisma/schema.prisma`, `middleware.ts`,
  `lib/auth`, `lib/observability`, `lib/audit`, `lib/security`, rutas `api/`,
  envío de mail. Son capas críticas.
- i18n: toda string nueva debe existir en eu y es. Consultar
  `docs/inventory-i18n` antes de añadir claves.
- A11y: contraste AA, foco visible, teclado, `prefers-reduced-motion`
  respetado siempre (especialmente en animaciones y three/vanta).
- Dos audiencias: /admin = densidad y velocidad; /portal y /acceso =
  calidez, confianza, mobile-first.
- Strings en euskera son largos: los layouts deben respirar.

## Comandos
- Dev: `npm run dev`
- Tests unit: `npm run test` (Vitest)
- Tests e2e: `npm run test:e2e` (Playwright)
- Lint: `npm run lint`
- Prisma: `npx prisma migrate dev`, `npx prisma db seed`

## Workflow por defecto
- Commits atómicos por vertical/ruta, mensajes descriptivos.
- Antes de declarar algo hecho: Vitest + Playwright en verde.
- Si una métrica Lighthouse baja respecto al baseline, arréglalo antes
  de cerrar.
- Si un cambio tocaría capas bloqueadas arriba, **preguntar primero**.

## MCPs y skills disponibles
- superpowers (brainstorming, writing-plans, executing-plans, TDD,
  debugging, verification)
- ui-ux-pro-max, frontend-design, context-engineering, claude-seo
- 21st-dev/magic, playwright, chrome-devtools, context7, shadcn-ui
