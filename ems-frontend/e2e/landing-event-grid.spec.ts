import { test, expect } from '@playwright/test';

test('landing -> event grid visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /upcoming events/i })).toBeVisible();
});
