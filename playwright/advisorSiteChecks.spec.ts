import { test, expect } from "@playwright/test";

const variations = ["aaronthame", "aamirjaved"];

variations.forEach((location) => {
  const url = `https://${location}.evrealestate.com`;

  test(`Testing Advisor profile sites at ${url}`, async ({ page }) => {
    await page.goto(url);
    await page.isVisible("text='My Website'");
  });
});
