import { test, expect } from '@playwright/test';

test('landing -> calendar section visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /calendar/i })).toBeVisible();
});
