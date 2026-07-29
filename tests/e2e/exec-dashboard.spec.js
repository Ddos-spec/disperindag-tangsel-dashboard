const { test, expect } = require('@playwright/test')

const ACCESS_CODE = process.env.ACCESS_CODE
if (!ACCESS_CODE) {
  throw new Error('ACCESS_CODE env var is not set - add it to .env.test (see .env.test.example)')
}

async function login(page) {
  await page.goto('/login')
  await page.fill('#login-code', ACCESS_CODE)
  await page.click('#login-button')
  await page.waitForURL(/\/api\/dashboard/)
}

test('unauthenticated visitors are redirected to the login gate', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole('heading', { name: 'Login Dashboard Strategis' })).toBeVisible()
})

test('wrong access code shows an error and does not log in', async ({ page }) => {
  await page.goto('/login')
  await page.fill('#login-code', 'definitely-wrong-code')
  await page.click('#login-button')
  await expect(page.locator('#login-error')).not.toBeEmpty()
  await expect(page).toHaveURL(/\/login/)
})

test('correct access code logs in and the dashboard renders real data', async ({ page }) => {
  await login(page)
  await expect(page.getByText('Executive Summary')).toBeVisible()
  await expect(page.getByText('Program Selaras').first()).toBeVisible()
})

test('AI Copilot answers from OpenRouter, not the local fallback template', async ({ page, request }) => {
  await login(page)
  const cookies = await page.context().cookies()
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ')

  const res = await request.post('/api/copilot', {
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    data: { question: 'Apa prioritas tertinggi ABT 2026?' },
  })
  expect(res.ok()).toBeTruthy()
  const body = await res.json()

  // This is the regression this suite exists to catch: if the OPENROUTER_API_KEY
  // is ever invalid/expired again, the API silently succeeds (200 OK) but falls
  // back to a canned template answer instead of a real AI response. A green
  // HTTP status alone would hide that failure - assert on `source` instead.
  expect(body.ok).toBe(true)
  expect(body.source).toBe('openrouter')
  expect(body.answer.length).toBeGreaterThan(20)
})
