import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.POST_REWORK_BASE_URL ?? "http://localhost:3001";

export default defineConfig({
  testDir: "./tests/audit",
  testMatch: /post-rework\.audit\.spec\.ts$/,
  timeout: 120_000,
  expect: { timeout: 15_000 },
  fullyParallel: false,
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: [["list"]],
  outputDir: ".audit/raw-post-rework",
  use: {
    baseURL,
    screenshot: "off",
    video: "off",
    trace: "off",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["iPhone 14 Pro"],
        browserName: "chromium",
      },
    },
  ],
});
