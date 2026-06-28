import { test, expect } from '@playwright/test'

test.describe('AGROPOLY BFA — smoke tests', () => {
  test('splash loads and shows logo + buttons', async ({ page }) => {
    await page.goto('/')
    // Click through intro to skip to phase 4
    await page.click('body')
    await expect(page.getByText('AGROPOLY')).toBeVisible({ timeout: 5000 })
    await expect(page.getByRole('button', { name: 'Nueva Partida' })).toBeVisible()
    await expect(page.getByRole('button', { name: /Cómo Jugar/ })).toBeVisible()
  })

  test('rules modal opens and shows tabs', async ({ page }) => {
    await page.goto('/')
    await page.click('body') // skip intro
    await page.getByRole('button', { name: /Cómo Jugar/ }).click()
    await expect(page.getByText('Cómo Jugar AGROPOLY BFA')).toBeVisible()
    await expect(page.getByRole('button', { name: /Objetivo/ })).toBeVisible()
    await expect(page.getByRole('button', { name: /Victoria/ })).toBeVisible()
  })

  test('lobby → solo game starts and shows board', async ({ page }) => {
    await page.goto('/lobby')
    await page.fill('input[placeholder="Nombre del jugador"]', 'TestPlayer')
    await page.getByRole('button', { name: /Iniciar Partida/ }).click()
    await expect(page).toHaveURL(/\/game/)
    // Scoreboard should show player name (truncated maybe)
    await expect(page.getByText('TestPlayer').first()).toBeVisible({ timeout: 5000 })
  })

  test('leaderboard route loads', async ({ page }) => {
    await page.goto('/leaderboard')
    await expect(page.getByText(/Leaderboard/)).toBeVisible()
  })

  test('achievements route loads with grid', async ({ page }) => {
    await page.goto('/achievements')
    await expect(page.getByText(/Mis Logros/)).toBeVisible()
    await expect(page.getByText(/Primer Propietario/)).toBeVisible()
  })
})
