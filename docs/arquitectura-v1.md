# Kodaore arquitectura V1

## Objetivo

Sistema unico para Azkoitia, Azpeitia y Zumaia, con control por sede y seguridad por roles.

## Stack base

- Next.js App Router
- TypeScript
- Prisma + PostgreSQL
- Tailwind CSS v4

## Modulos V1

- Usuarios, roles y permisos
- Sedes y configuracion operativa
- Profesorado con etiquetas
- Familias y alumnos
- Grupos, sesiones y asistencias
- Cuotas, recibos y remesas
- Comunicaciones
- Auditoria e importaciones

## Rutas web iniciales

- /eu
- /es
- /eu/admin
- /eu/portal
- /eu/acceso

## Seguridad

- Matriz de permisos por rol
- Datos bancarios en campo cifrado + version enmascarada
- Registro de auditoria por acciones sensibles

## Pendiente para siguiente sprint

- Autenticacion con NextAuth
- Guardas de permisos en backend y frontend
- CRUD de alumnos/profesores/grupos
- Importador Excel operativo
- Flujo de remesas por fichero bancario
