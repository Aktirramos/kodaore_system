#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const pkg = JSON.parse(await fs.readFile("package.json", "utf8"));
const headSha = execSync("git rev-parse HEAD").toString().trim();
const headDate = execSync("git log -1 --format=%cI HEAD").toString().trim();
const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();

const info = {
  capturedAt: new Date().toISOString(),
  git: { sha: headSha, branch, lastCommitAt: headDate },
  runtime: {
    next: pkg.dependencies.next,
    react: pkg.dependencies.react,
    tailwindcss: pkg.devDependencies.tailwindcss,
    playwright: pkg.devDependencies["@playwright/test"],
  },
};

await fs.mkdir(".audit/baseline", { recursive: true });
await fs.writeFile(path.join(".audit/baseline/build-info.json"), JSON.stringify(info, null, 2));
console.log(info);
