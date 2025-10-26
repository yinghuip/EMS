import { test, expect } from '@playwright/test';

test('landing -> past concerts section visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /past concerts/i })).toBeVisible();
});
