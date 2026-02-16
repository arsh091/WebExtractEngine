import { test, expect } from '@playwright/test';

test('complete extraction flow', async ({ page }) => {
    await page.goto('/');

    // Verify hero text
    await expect(page.locator('h1')).toContainText('Extract Data');

    // Fill form
    const input = page.locator('input[placeholder*="Enter website"]');
    await input.fill('https://example.com');

    // Click extract
    await page.click('button:has-text("EXTRACT INTELLIGENCE")');

    // Check for loading state or results
    // Since we are mocking or calling the real API, we wait for results-section
    await expect(page.locator('#results-section')).toBeVisible({ timeout: 60000 });
});
