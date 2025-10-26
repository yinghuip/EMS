import { test, expect } from '@playwright/test';

test('landing shows up to 3 upcoming events within 90 days', async ({ page }) => {
  await page.goto('/');

  // Wait for the upcoming section to be present
  const section = page.locator('.upcoming-events');
  await expect(section).toBeVisible({ timeout: 5000 });

  // Count event cards within the upcoming section
  const cards = section.locator('.event-card');
  const count = await cards.count();

  // There should be at most 3 event cards shown on the landing page
  expect(count).toBeLessThanOrEqual(3);

  // If there is at least one card, the View all events link should exist
  if (count > 0) {
    await expect(page.getByRole('link', { name: /view all events/i })).toBeVisible();
  } else {
    // If none, the empty message should be visible
    await expect(section).toContainText(/no upcoming events in the next 90 days/i);
  }
});
