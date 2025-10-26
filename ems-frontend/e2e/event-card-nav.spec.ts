import { test, expect } from '@playwright/test';

test('clicking an event card navigates to event detail', async ({ page }) => {
  await page.goto('/events');

  const card = page.locator('.event-card').first();
  await expect(card).toBeVisible({ timeout: 5000 });

  // Check the overlay anchor's href first to ensure target includes the id
  const overlay = card.locator('a.card-link-overlay');
  await expect(overlay).toBeVisible();
  const href = await overlay.getAttribute('href');
  expect(href).toMatch(/\/events\//);

  await card.click();

  // Expect navigation to a URL that includes /events/<id>
  await expect(page).toHaveURL(/\/events\//);
});
