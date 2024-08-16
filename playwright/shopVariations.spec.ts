import { test, expect } from "@playwright/test";

const variations = ["atlanta"];

variations.forEach((location) => {
  const url = `https://${location}.evrealestate.com`;

  test(`Testing properties variation at ${url}`, async ({ page }) => {
    await page.goto(url);

    await page.waitForSelector('#onetrust-banner-sdk', { state: 'visible' });
    await page.click('#onetrust-accept-btn-handler');

    // Verify the title of the page
    const expectedSubstring = "Engel & Völkers";
    const actualTitle = await page.title();

    expect(actualTitle).toContain(expectedSubstring);

    // Verify properties has at least one listing
    await page.click('[data-test-id="properties"]');
    await page.waitForSelector('[data-test-id^="property-listing-card-wrapper-"]');

    const container = page.locator(
      '[data-test-id="property-listing-styled-card-container"]'
    );
    const cardWrappers = container.locator(
      '[data-test-id^="property-listing-card-wrapper-"]'
    );
    const count = await cardWrappers.count();

    expect(count).toBeGreaterThan(1);
  });

  test(`Testing advisors variation at ${url}`, async ({ page }) => {
    await page.goto(url);

    await page.waitForSelector('#onetrust-banner-sdk', { state: 'visible' });
    await page.click('#onetrust-accept-btn-handler');

    // Verify Advisor link is working
    await page.click('[data-test-id="our-advisors"]');
    await page.waitForSelector('[data-test-id^="advisor-card-styled-card-container"]');

    const container = page.locator(
      '[data-test-id="advisor-card-styled-card-container"]'
    );
    const cardWrappers = container.locator(
      '[data-test-id^="advisor-card-card-wrapper-"]'
    );
    const count = await cardWrappers.count();

    expect(count).toBeGreaterThan(1);
  });


});
