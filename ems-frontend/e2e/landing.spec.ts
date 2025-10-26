import { test, expect } from '@playwright/test';

test('landing -> open featured event', async ({ page }) => {
  await page.goto('/');

  // Wait for hero CTA to appear and click it. The hero has 'Learn more' and 'Register Now' CTAs.
  const learn = page.getByRole('link', { name: /learn more/i });
  const register = page.getByRole('link', { name: /register now|register/i });
  if (await learn.isVisible().catch(() => false)) {
    await learn.click();
  } else if (await register.isVisible().catch(() => false)) {
    await register.click();
  } else {
    throw new Error('No hero CTA found');
  }

  // After click we should be on an event detail route
  await page.waitForURL('**/events/*', { timeout: 5000 });
  expect(page.url()).toMatch(/\/events\/.+/);

  // Basic content check: registration CTA visible on event detail (at least one)
  await expect(page.getByRole('link', { name: /register/i }).first()).toBeVisible();
});
