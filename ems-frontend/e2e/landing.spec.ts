import { test, expect } from '@playwright/test';

test('landing -> open featured event', async ({ page }) => {
  await page.goto('/');

  // Wait for hero CTA to appear and click it
  const cta = page.getByRole('link', { name: /view details/i });
  await expect(cta).toBeVisible({ timeout: 5000 });
  await cta.click();

  // After click we should be on an event detail route
  await page.waitForURL('**/events/*', { timeout: 5000 });
  expect(page.url()).toMatch(/\/events\/.+/);

  // Basic content check: registration CTA visible on event detail
  await expect(page.getByRole('link', { name: /register/i })).toBeVisible();
});
