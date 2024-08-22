import { test, expect } from "@playwright/test";
import { fetchAndExtractShopSites } from "./shopTestUtils";

let websites: string[] = [];

test.describe('Shop Site Tests', () => {

  // Fetch the websites before running the tests
  test.beforeAll(async () => {
    websites = await fetchAndExtractShopSites();
    console.log(`Total websites to test: ${websites.length}`);
  });

  // Create a single test that iterates over all websites
  test('Run tests for all shops', async ({ page }) => {
    for (let index = 0; index < websites.length; index++) {
      const url = websites[index];
      console.log(`Running Test ${index + 1}/${websites.length} - ${url}`);
      await testProperties(page, url);
      await testAdvisors(page, url);
    }
  });

  // Dynamically set the test timeout based on the number of websites
  test.beforeEach(() => {
    const dynamicTimeout = 10000 * websites.length;
    test.setTimeout(dynamicTimeout);
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
