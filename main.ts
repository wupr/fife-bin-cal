import { chromium } from "playwright";

const postcode: string = Deno.args[0];
const number: string = Deno.args[1];

// Initialize browser and page
const browser = await chromium.launch({
  channel: "chromium",
});
const page = await browser.newPage();

// Visit Fife Council's bin calendar look-up form
await page.goto("https://www.fife.gov.uk/services/forms/bin-calendar");

// Reject cookies
await page.locator("#fc-reject-settings").click();

// Fill in the postcode and click the search button
const postcodeUpper = postcode.toUpperCase();
await page.getByLabel("postcode").fill(postcodeUpper);
await page.getByRole("button", { name: /search/i }).click();
console.error(`Submitted postcode '${postcodeUpper}'.`);

// Wait for the `select` to appear
const select = page.locator("#dform_widget_ps_3SHSN93_id");
await select.waitFor({ state: "visible" });

// Choose the option that starts with the number
const option = select.locator("option").filter({
  hasText: new RegExp(`^${number},`, "i"),
});
const optionValue = await option?.getAttribute("value");
if (optionValue) {
  await select.selectOption(optionValue);
  console.error(`Selected address '${await option?.innerText()}'.`);
} else {
  console.error("Failed to select address.");
  page.close();
  browser.close();
  Deno.exit(1);
}

// Wait for the table of collection dates to appear
const table = page.locator("#dform_table_tab_collections");
await table.waitFor({ state: "visible" });

// Wait for the table to be populated
const start = Date.now();
while (Date.now() - start < 5_000) {
  if (await table.locator(":scope > div").count() > 1) {
    break;
  }
  await new Promise((resolve) => setTimeout(resolve, 100));
}

// Go through each data row in the table and print the information
const rows = await table.locator(":scope > div:not(:first-child)").all();
for (const row of rows) {
  const dateText = await row.locator("div:nth-child(2)").innerText();
  const collectionDate =
    new Date(dateText + " UTC").toISOString().split("T")[0];
  const binType = await row.locator("div:nth-child(3)").innerText();
  console.log(`${collectionDate}\t${binType}`);
}

// Close page and browser
page.close();
browser.close();
