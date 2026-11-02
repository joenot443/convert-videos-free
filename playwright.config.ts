import { defineConfig, devices } from '@playwright/test';

// Set E2E_BASE_URL to test an already-running server (a production container or
// the live site). Without it, a dev server is started on port 4444.
const baseURL = process.env.E2E_BASE_URL ?? 'http://localhost:4444';

export default defineConfig({
  testDir: './tests',
  testMatch: ['real-converter.spec.ts', 'real-crop.spec.ts', 'site.spec.ts', 'unit/**/*.spec.ts'],
  timeout: 120 * 1000,
  expect: {
    timeout: 10000
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    acceptDownloads: true,
  },

  projects: [
    {
      name: 'chrome',
      use: {
        ...devices['Desktop Chrome'],
        // Real Chrome, not Playwright's Chromium: the open-source build has no
        // H.264/AAC encoders, so conversions cannot run on it at all.
        channel: 'chrome',
      },
    },
  ],

  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: 'npm run dev',
        port: 4444,
        reuseExistingServer: true,
        timeout: 120 * 1000,
      },
});
