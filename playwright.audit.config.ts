import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.AUDIT_BASE_URL ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./tests/audit",
  testMatch: /.*\.audit\.spec\.ts$/,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-audit-report" }]],
  outputDir: ".audit/raw",
  use: {
    baseURL,
    screenshot: "off",
    video: "off",
    trace: "off",
  },
  projects: [
    {
      name: "setup-admin",
      testMatch: /_setup\/login-admin\.setup\.ts/,
    },
    {
      name: "setup-familia",
      testMatch: /_setup\/login-familia\.setup\.ts/,
    },
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
      dependencies: ["setup-admin", "setup-familia"],
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["iPhone 14 Pro"],
        browserName: "chromium",
      },
      dependencies: ["setup-admin", "setup-familia"],
    },
  ],
  webServer: {
    command: "echo 'using running PM2 on :3000'",
    url: baseURL,
    reuseExistingServer: true,
    timeout: 5_000,
  },
});
