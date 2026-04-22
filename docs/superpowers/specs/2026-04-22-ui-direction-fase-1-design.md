# Spec — Fase 1 de Kodaore (dirección visual + motion)

Este archivo es un apuntador. El documento canónico con tokens, tipografía y sistema de motion vive en `docs/ui-design-direction.md`. Ese es el path exigido por la mission y es el único sitio donde se mantiene la verdad.

Decisiones principales captadas durante el brainstorming:

- Dirección visual: **Dojo Moderno** (entre Washi & Sumi, Oinarri y Dojo Moderno).
- Chroma base: **light papel cálido** (`#fafaf7`); dark via `prefers-color-scheme` sin toggle UI.
- Brand: carmesí `#c2272d` (del logo). Accent: esmeralda `#1fa35c` (del logo).
- Tipografía: Inter única (variable + Inter Display en ≥20px). Retira Manrope + Space Grotesk.
- Motion: tokens `fast/base/slow/hero`, mix Tailwind+CSS + Motion (ex-Framer) ~12KB gz.
- Retiradas explícitas: Vanta, `InitialLoader` 3D, `HomeHeroScrollSync`, 4 animaciones infinitas, `k-hover-*` utilities unificadas.

Artefactos del brainstorming visual guardados en `.superpowers/brainstorm/` (gitignored):
- `content/chroma-base.html` (decisión de base cromática)
- `content/direcciones.html` (3 direcciones visuales)
- `content/sec1-paleta.html` (paleta completa)
- `content/sec2-tipografia-escala.html` (tipografía + spacing + radius + shadow)
- `content/sec3-motion.html` (motion system)

Siguiente paso según el workflow: `superpowers:writing-plans` sobre `docs/ui-design-direction.md` para emitir `docs/superpowers/plans/2026-04-22-ui-direction-fase-1.md` una vez que el usuario valide.
