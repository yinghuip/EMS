import { test, expect } from '@playwright/test';

test.describe('landing -> responsive layout', () => {
  test('mobile 375px shows sections', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /upcoming events/i })).toBeVisible();
  });

  test('tablet 768px shows sections', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /calendar/i })).toBeVisible();
  });

  test('desktop 1200px shows sections', async ({ page }) => {
    await page.setViewportSize({ width: 1200, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /past concerts/i })).toBeVisible();
  });
});
