# Kodaore arquitectura V2 (propuesta de reorganizacion)

## Objetivo

Reorganizar la app con App Router para:

- mejorar navegacion de desarrolladores por dominio funcional;
- reducir archivos monoliticos en rutas y componentes;
- reforzar separacion entre componentes de servidor y cliente;
- soportar mejor la operativa multi-sede sin duplicar logica.

Esta propuesta mantiene las URLs publicas actuales y usa grupos de rutas y carpetas privadas para estructurar internamente el codigo.

## Problemas actuales detectados

- Modulos de dominio muy extensos (`lib/admin.ts` concentra muchas responsabilidades).
- Componentes de UI largos en admin (tabla de alumnos, grupos y cobros en un unico archivo por modulo).
- Mezcla de responsabilidades en segmentos de ruta (fetching, permisos, transformaciones y UI juntos en la misma capa).
- Componentes compartidos en carpeta plana `components/`, dificil de escalar por dominios.

## Principios de la V2

1. Co-locacion por segmento: la logica vive cerca de la ruta que la usa.
2. Segmentos con API minima: `page.tsx` y `layout.tsx` orquestan; no concentran logica de negocio.
3. Separacion estricta server/client:
   - Server Components por defecto.
   - Client Components solo donde haya estado local, handlers de eventos o APIs del navegador.
4. Carpetas privadas `_` para implementacion interna no enrutable.
5. Modulos de dominio granulares por feature (students, groups, billing, portal, auth, media).
6. Multi-sede transversal: filtro de sede y permisos en capa server, no en UI.

## Arbol propuesto (alto nivel)

```text
app/
  (marketing)/
    page.tsx
  acceso/
    page.tsx
  api/
    auth/
    health/
    observability/

  [locale]/
    layout.tsx
    not-found.tsx

    (public)/
      page.tsx
      erropak/
        page.tsx
        _components/
        _data/
      fototeca/
        page.tsx
        _components/
        _data/
      sedes/
        page.tsx
        [site]/
          page.tsx
          _components/
      tienda/
        page.tsx
      legal/
        privacy/page.tsx
        terms/page.tsx

    (auth)/
      acceso/
        page.tsx
        crear-cuenta/page.tsx
        _components/
        _actions/
        _schemas/

    (backoffice)/
      admin/
        layout.tsx
        loading.tsx
        error.tsx
        page.tsx

        _shared/
          _components/
          _schemas/
          _mappers/

        _site-context/
          resolve-active-site.server.ts
          enforce-admin-site-scope.server.ts

        students/
          page.tsx
          [studentId]/
            page.tsx
          _components/
            students-table.client.tsx
            student-edit-modal.client.tsx
            student-create-modal.client.tsx
            students-toolbar.tsx
          _actions/
            create-student.action.ts
            update-student.action.ts
            delete-student.action.ts
            bulk-import-students.action.ts
          _data/
            get-students.query.ts
            get-student-detail.query.ts
          _schemas/
            student-form.schema.ts
            student-import.schema.ts
          _mappers/
            student-row.mapper.ts

        groups/
          page.tsx
          _components/
          _actions/
          _data/
          _schemas/
          _mappers/

        billing/
          page.tsx
          _components/
          _actions/
          _data/
          _schemas/
          _mappers/

    (family-portal)/
      portal/
        layout.tsx
        loading.tsx
        error.tsx
        page.tsx
        profile/page.tsx
        payments/page.tsx
        messages/page.tsx
        _components/
        _data/
        _mappers/

features/
  admin/
    students/
      contracts.ts
      dto.ts
      permissions.ts
    groups/
    billing/
  portal/
  auth/
  observability/

shared/
  ui/
  i18n/
  security/
  db/
  utils/
```

## Como se aplican los grupos de rutas

- `(public)`: contenido publico localizado (home, sedes, galerias, legal, tienda).
- `(auth)`: entrada de usuarios (acceso y creacion de cuenta).
- `(backoffice)`: area de gestion (`/admin/*`).
- `(family-portal)`: area de familias (`/portal/*`).

Los grupos no cambian URL final, pero reducen acoplamiento y facilitan layouts especializados por area.

## Patron de segmento recomendado

Cada feature de ruta debe seguir este contrato minimo:

```text
feature/
  page.tsx                  -> Server Component orquestador
  loading.tsx               -> opcional
  error.tsx                 -> opcional (Client Boundary)
  _components/              -> presentacion (server/client)
  _data/                    -> queries server + joins Prisma
  _actions/                 -> server actions mutables
  _schemas/                 -> zod, validacion de entrada
  _mappers/                 -> transformaciones VM/DTO
  _constants/               -> enums y config local
```

## Delimitacion server/client (reglas claras)

1. Server first:
   - `page.tsx`, `layout.tsx`, `generateMetadata`, queries Prisma y chequeos de permiso en server.
2. Client opt-in:
   - solo en `*.client.tsx` para tablas interactivas, modales, formularios con estado local o animaciones.
3. Nombres explicitos:
   - `*.server.ts` para helpers server-only;
   - `*.client.tsx` para componentes cliente;
   - `actions.ts` o `*.action.ts` para mutaciones.
4. Barrera de entorno:
   - importar `server-only` en modulos de `_data` y `_site-context`.
5. Datos serializables:
   - en `page.tsx`, pasar a cliente un ViewModel ya transformado (sin objetos Prisma crudos).

## Estrategia multi-sede recomendada

Centralizar resolucion de sede activa en un unico punto server:

- `admin/_site-context/resolve-active-site.server.ts`: calcula sede activa desde rol, cookie, query param o default seguro.
- `admin/_site-context/enforce-admin-site-scope.server.ts`: valida que la sede solicitada esta dentro del alcance del usuario.

Luego, cada query de `_data` recibe `siteScope` tipado y no decide permisos por su cuenta.

## Como desmontar monolitos existentes

### `lib/admin.ts`

Separar por feature y responsabilidad:

- `features/admin/students/read.ts`
- `features/admin/students/write.ts`
- `features/admin/students/schemas.ts`
- `features/admin/groups/read.ts`
- `features/admin/groups/write.ts`
- `features/admin/billing/read.ts`
- `features/admin/billing/write.ts`

`lib/admin.ts` puede mantenerse como facade temporal durante la migracion para evitar romper imports de golpe.

### Componentes de admin extensos

Ejemplo de descomposicion para students:

- `students-table.client.tsx` (render principal de tabla)
- `student-table-columns.tsx` (definicion de columnas)
- `student-edit-modal.client.tsx`
- `student-create-modal.client.tsx`
- `student-import-panel.client.tsx`
- `students-toolbar.tsx`

## Convenciones anti-archivo-extenso

- `page.tsx`: objetivo <= 120 lineas.
- `layout.tsx`: objetivo <= 160 lineas.
- `*_table*.client.tsx`: dividir cuando supere 250 lineas.
- `lib`/`features` de dominio: dividir cuando supere 350 lineas o tenga mas de 6 exports publicos.
- Una carpeta `_components` no debe mezclar widgets de dos features distintas.

## Plan de migracion por fases

1. Introducir grupos de rutas sin mover logica (solo estructura).
2. Crear carpetas privadas `_components`, `_data`, `_actions`, `_schemas` en admin/portal.
3. Extraer `lib/admin.ts` por dominios (`features/admin/*`) con facade temporal.
4. Dividir componentes largos de admin en piezas pequenas por feature.
5. Mover utilidades compartidas desde `components/` a `shared/ui` y dejar wrappers de compatibilidad temporal.
6. Endurecer reglas de lint/tamano de archivo (si se desea, con regla custom de max-lines por carpeta).

## Impacto esperado

- Menos conflictos de merge en archivos centrales.
- Menor tiempo para localizar codigo de una ruta concreta.
- Menor riesgo de regresion por responsabilidades mezcladas.
- Mejor base para evolucion multi-sede (filtros y permisos consistentes).
- Facilita testear por unidades de feature (queries, actions, mappers, UI).
