import { test, expect } from "@playwright/test";
import { fetchAndExtractShopSites } from "./shopTestUtils";

test.describe('Shop Site Tests', () => {
  test('Test properties and advisors for all websites', async ({ page }) => {
    const websites = await fetchAndExtractShopSites();
    console.log(`Total websites to test: ${websites.length}`);

    const dynamicTimeout = 10000 * websites.length;
    test.setTimeout(dynamicTimeout);

    for (const url of websites) {
      await test.step(`Testing ${url}`, async () => {
        await testProperties(page, url);
        await testAdvisors(page, url);
      });
    }
  });
});

async function handleOneTrustBanner(page) {
  try {
    await page.waitForSelector('#onetrust-banner-sdk', { state: 'visible', timeout: 100 });
    await page.click('#onetrust-accept-btn-handler');
  } catch (error) {
    // Banner not found, continue with the test
  }
}

async function testProperties(page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await handleOneTrustBanner(page);

  const expectedSubstring = "Engel & Völkers";
  const actualTitle = await page.title();
  expect(actualTitle).toContain(expectedSubstring);

  await page.click('[data-test-id="properties"]');
  await page.waitForSelector('[data-test-id^="property-listing-card-wrapper-"]');

  const container = page.locator('[data-test-id="property-listing-styled-card-container"]');
  const cardWrappers = container.locator('[data-test-id^="property-listing-card-wrapper-"]');
  const count = await cardWrappers.count();
  expect(count).toBeGreaterThan(1);
}

async function testAdvisors(page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
  await handleOneTrustBanner(page);

  await page.click('[data-test-id="our-advisors"]');
  await page.waitForSelector('[data-test-id^="advisor-card-styled-card-container"]');

  const container = page.locator('[data-test-id="advisor-card-styled-card-container"]');
  const cardWrappers = container.locator('[data-test-id^="advisor-card-card-wrapper-"]');
  const count = await cardWrappers.count();
  expect(count).toBeGreaterThan(1);
}