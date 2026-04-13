# Runbook de Produccion

## 1. Objetivo

Guia operativa para incidencias, rollback y recuperacion en Kodaore System.

## 2. Checklist pre-despliegue

- CI en verde: lint, unit, build, e2e smoke.
- Variables de entorno de produccion configuradas.
- `npm run db:migrate:deploy` probado en entorno de staging.
- Backup reciente de la base de datos.

## 3. Despliegue estandar

1. Publicar commit en `main`.
2. Ejecutar despliegue del proveedor.
3. Aplicar migraciones de produccion:

```bash
npm run db:migrate:deploy
```

4. Verificar health endpoint:

```bash
curl -fsS https://TU_DOMINIO/api/health
```

5. Verificar login gestion y familia manualmente.

## 4. Rollback de aplicacion

Usar rollback de la plataforma (Vercel, Render, etc.) al despliegue anterior.

Validaciones tras rollback:

- Health endpoint en estado `ok` o `degraded` controlado.
- Login y rutas privadas operativas.

## 5. Rollback de datos

No hacer rollback de schema con scripts manuales sin backup.

Procedimiento recomendado:

1. Restaurar backup de base de datos en entorno aislado.
2. Validar consistencia funcional.
3. Programar ventana de mantenimiento para restauracion en produccion.

## 6. Backup y restauracion

Politica recomendada:

- Backup completo diario.
- Backup incremental cada hora.
- Retencion minima: 14 dias.

Prueba de restauracion:

- Ejecutar al menos 1 vez al mes en entorno de staging.
- Documentar tiempo de recuperacion real (RTO) y perdida de datos max (RPO).

## 7. Incidencias y respuesta

Severidades:

- Sev1: caida total o login no disponible.
- Sev2: degradacion relevante de rendimiento o errores parciales.
- Sev3: errores menores sin impacto principal.

Pasos de respuesta:

1. Confirmar impacto con `api/health` + logs.
2. Mitigar (rollback o feature flag).
3. Comunicar estado y ETA.
4. Ejecutar postmortem en <48h.

## 8. Verificaciones periodicas

- Workflow `Maintenance` ejecutando limpieza sin errores.
- Workflow `Uptime Monitor` ejecutando correctamente.
- `npm run maintenance:cleanup-rate-limit` probado manualmente en mantenimiento mensual.
- `npm run test:load:smoke` en staging antes de cambios mayores.
