"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  fadeUp,
  fadeUpTransition,
  staggerChildren,
  modalIn,
  modalInTransition,
  toastIn,
  toastInTransition,
  MOTION_DURATION,
  useReducedMotion,
} from "@/components/motion";
import { Button, Card, Badge, Skeleton } from "@/components/ui";

const COLOR_TOKENS = [
  { group: "Surface", tokens: ["surface-base", "surface-subtle", "surface-elevated", "surface-inverse"] },
  { group: "Ink", tokens: ["ink-primary", "ink-secondary", "ink-muted-2", "ink-inverse"] },
  { group: "Border", tokens: ["border-subtle", "border-default", "border-strong", "border-focus"] },
  { group: "Brand", tokens: ["brand-base", "brand-emphasis-2", "brand-subtle", "brand-contrast-2"] },
  { group: "Accent", tokens: ["accent-base", "accent-emphasis", "accent-subtle"] },
  { group: "Estados", tokens: ["success-base", "warning-base", "info-base", "danger-base"] },
];

const RADIUS_TOKENS = ["sm", "md", "lg", "xl", "2xl", "pill"];
const SHADOW_TOKENS = ["sm", "md", "lg"];

export default function DevThemePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const reduced = useReducedMotion();

  return (
    <main style={{ background: "var(--color-surface-base)", color: "var(--color-ink-primary)", minHeight: "100vh", padding: "48px 24px", fontFamily: "var(--font-inter), system-ui, sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <header style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: 0 }}>Dev harness</p>
          <h1 style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 600, letterSpacing: "-0.02em", margin: "8px 0 8px" }}>Tokens Fase 1 — Dojo Moderno</h1>
          <p style={{ fontSize: 15, color: "var(--color-ink-secondary)", margin: 0 }}>
            Página de validación visual. No enlazada desde navegación. Reduced motion detectado: <b>{reduced ? "sí" : "no"}</b>.
          </p>
        </header>

        {COLOR_TOKENS.map((g) => (
          <section key={g.group} style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>{g.group}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {g.tokens.map((t) => (
                <div key={t} style={{ borderRadius: "var(--radius-lg)", border: "1px solid var(--color-border-default)", overflow: "hidden", background: "var(--color-surface-elevated)" }}>
                  <div style={{ height: 72, background: `var(--color-${t})` }} />
                  <div style={{ padding: "10px 12px", fontSize: 12 }}>
                    <div style={{ fontWeight: 600 }}>{t}</div>
                    <div style={{ color: "var(--color-ink-muted-2)", fontFamily: "ui-monospace, monospace", marginTop: 2 }}>
                      var(--color-{t})
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Radius</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {RADIUS_TOKENS.map((r) => (
              <div key={r} style={{ width: 80, height: 80, background: "var(--color-brand-base)", color: "var(--color-brand-contrast-2)", borderRadius: `var(--radius-${r})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>
                {r}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Shadow</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
            {SHADOW_TOKENS.map((s) => (
              <div key={s} style={{ padding: 20, background: "var(--color-surface-elevated)", borderRadius: "var(--radius-lg)", boxShadow: `var(--shadow-${s})`, textAlign: "center", fontSize: 12 }}>
                shadow.{s}
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Motion — fadeUp</h2>
          <motion.div
            key={Math.random()}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            transition={fadeUpTransition}
            style={{ padding: 18, background: "var(--color-surface-subtle)", borderRadius: "var(--radius-lg)", fontSize: 14 }}
          >
            Este bloque entra con fadeUp (opacity + y {4}px, 200ms ease.enter).
          </motion.div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Motion — stagger (6 items)</h2>
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
            style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.li
                key={i}
                variants={fadeUp}
                transition={fadeUpTransition}
                style={{ padding: "14px 12px", background: "var(--color-surface-subtle)", borderRadius: "var(--radius-md)", fontSize: 13 }}
              >
                Item {i + 1}
              </motion.li>
            ))}
          </motion.ul>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Motion — modal y toast</h2>
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setModalOpen(true)}
              style={{ padding: "10px 16px", background: "var(--color-brand-base)", color: "var(--color-brand-contrast-2)", border: 0, borderRadius: "var(--radius-pill)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            >
              Abrir modal
            </button>
            <button
              onClick={() => {
                setToastVisible(true);
                window.setTimeout(() => setToastVisible(false), 2400);
              }}
              style={{ padding: "10px 16px", background: "var(--color-surface-elevated)", color: "var(--color-ink-primary)", border: "1px solid var(--color-border-default)", borderRadius: "var(--radius-pill)", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
            >
              Mostrar toast
            </button>
          </div>
        </section>

        <AnimatePresence>
          {modalOpen && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: MOTION_DURATION.slow }}
              style={{ position: "fixed", inset: 0, background: "#000", zIndex: 50 }}
              onClick={() => setModalOpen(false)}
            />
          )}
          {modalOpen && (
            <motion.div
              key="modal"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={modalIn}
              transition={modalInTransition}
              style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", background: "var(--color-surface-elevated)", padding: 24, borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-lg)", zIndex: 51, maxWidth: 420 }}
              role="dialog"
              aria-modal="true"
              aria-label="Modal de demo"
            >
              <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 600 }}>Modal de demo</h3>
              <p style={{ margin: "0 0 14px", fontSize: 14, color: "var(--color-ink-secondary)" }}>
                Entra con scale 0.96→1 + opacity en duración slow.
              </p>
              <button
                onClick={() => setModalOpen(false)}
                style={{ padding: "8px 14px", background: "var(--color-brand-base)", color: "var(--color-brand-contrast-2)", border: 0, borderRadius: "var(--radius-pill)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
              >
                Cerrar
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {toastVisible && (
            <motion.div
              key="toast"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={toastIn}
              transition={toastInTransition}
              style={{ position: "fixed", bottom: 24, right: 24, background: "var(--color-surface-inverse)", color: "var(--color-ink-inverse)", padding: "12px 18px", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)", zIndex: 60, fontSize: 13, fontWeight: 500 }}
              role="status"
              aria-live="polite"
            >
              Toast de demo — entra con slide-up + fade.
            </motion.div>
          )}
        </AnimatePresence>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Primitiva — Button</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button size="sm">sm</Button>
            <Button size="md">md</Button>
            <Button size="lg">lg</Button>
            <Button disabled>Disabled</Button>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Primitiva — Card</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <Card>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Default</div>
              <div style={{ fontSize: 13, color: "var(--color-ink-secondary)" }}>surface-elevated + border subtle.</div>
            </Card>
            <Card variant="subtle">
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Subtle</div>
              <div style={{ fontSize: 13, color: "var(--color-ink-secondary)" }}>surface-subtle. Bloque interior sin peso.</div>
            </Card>
            <Card interactive>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Interactive</div>
              <div style={{ fontSize: 13, color: "var(--color-ink-secondary)" }}>Hover me: lift + shadow.</div>
            </Card>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Primitiva — Badge</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Badge tone="brand">brand</Badge>
            <Badge tone="accent">accent</Badge>
            <Badge tone="neutral">neutral</Badge>
            <Badge tone="success">success</Badge>
            <Badge tone="warning">warning</Badge>
            <Badge tone="info">info</Badge>
            <Badge tone="danger">danger</Badge>
          </div>
        </section>

        <section style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-ink-muted-2)", margin: "0 0 12px" }}>Primitiva — Skeleton</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
            <Skeleton style={{ height: 120, width: "100%" }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <Skeleton style={{ height: 20, width: "70%" }} />
              <Skeleton style={{ height: 16, width: "100%" }} />
              <Skeleton style={{ height: 16, width: "90%" }} />
              <Skeleton style={{ height: 16, width: "60%" }} />
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--color-ink-muted-2)", marginTop: 8 }}>
            Con `prefers-reduced-motion: reduce` activado, el pulse se detiene.
          </p>
        </section>

      </div>
    </main>
  );
}
