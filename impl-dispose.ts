import { Browser, BrowserType, LaunchOptions } from "playwright";

export async function createBrowserResource(
  browserType: BrowserType,
  options?: LaunchOptions,
) {
  const browser = await browserType.launch(options);
  return {
    browser,
    async [Symbol.asyncDispose]() {
      await browser.close();
    },
  };
}
export async function createPageResource(browser: Browser) {
  const page = await browser.newPage();
  return {
    page,
    async [Symbol.asyncDispose]() {
      await page.close();
    },
  };
}
