require('dotenv').config({ path: '.env.test' })
const { defineConfig, devices } = require('@playwright/test')

const isCI = Boolean(process.env.CI)
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'https://exec-dashboard-ashen.vercel.app'

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
