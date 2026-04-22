#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const log = (msg) => console.log(`[audit] ${msg}`);

async function rimraf(p) {
  await fs.rm(p, { recursive: true, force: true });
}

async function walk(dir, match) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(full, match)));
    else if (match(full)) out.push(full);
  }
  return out;
}

async function reorganizeVideos() {
  const raw = ".audit/raw";
  const webms = await walk(raw, (p) => p.endsWith(".webm"));
  // Los slugs de Playwright derivan del nombre del spec (videos-flow-N-*.audit.spec.ts),
  // no del nombre del test. Por eso el needle usa "flow" y el destino "flujo".
  const mapping = [
    { needle: "flow-1-", dest: ".audit/baseline/videos/flujo-1-login-familia.webm" },
    { needle: "flow-2-", dest: ".audit/baseline/videos/flujo-2-admin-nav.webm" },
    { needle: "flow-3-", dest: ".audit/baseline/videos/flujo-3-modales.webm" },
    { needle: "flow-4-", dest: ".audit/baseline/videos/flujo-4-form-validation.webm" },
  ];
  await fs.mkdir(".audit/baseline/videos", { recursive: true });
  for (const m of mapping) {
    const match = webms.find((w) => w.includes(m.needle));
    if (match) {
      await fs.copyFile(match, m.dest);
      log(`video ${path.basename(m.dest)} OK`);
    } else {
      log(`AVISO: no hay vídeo para ${m.needle} (diferido a Fase 0.b si es auth-gated)`);
    }
  }
}

async function main() {
  log("limpieza previa");
  await rimraf(".audit/raw");
  await rimraf("playwright-audit-report");
  await rimraf(".audit/baseline/videos");
  // Screenshot directories are regenerated per test; we only clean raw+videos.

  log("screenshots (desktop + mobile, sin setups porque auth está diferido a 0.b)");
  execSync(
    "npx playwright test --config=playwright.audit.config.ts --project=chromium-desktop --project=chromium-mobile --no-deps screenshots",
    { stdio: "inherit" },
  );

  log("vídeo — flujo 4 (desktop, público)");
  execSync(
    "npx playwright test --config=playwright.audit.config.ts --project=chromium-desktop --no-deps videos-flow-4-form-validation",
    { stdio: "inherit" },
  );

  // Flujos 1, 2, 3 se re-activarán en Fase 0.b (requieren storageState admin/familia).

  log("reorganización de vídeos");
  await reorganizeVideos();

  log("done (Fase 0 reducida)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
