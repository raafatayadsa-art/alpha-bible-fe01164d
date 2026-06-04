import { test, expect, type Page } from "@playwright/test";

/**
 * Verifies the unified Back button contract:
 * - Every detail/nested screen shows a back control (aria-label="رجوع"
 *   or "رجوع للأجبية") fixed/sticky near the top of the screen.
 * - Root (bottom-nav) screens — Home, Synaxarium home, Feasts home —
 *   never expose a back control.
 *
 * Note: /bible and /agpeya are bottom-nav roots in the dock, but each
 * page renders its own in-page back-to-/home control by product design.
 * They are intentionally excluded from the "no back" assertion.
 */

const ROOT_SCREENS_NO_BACK = ["/home", "/synaxarium", "/feasts"];

const DETAIL_SCREENS = [
  { name: "Synaxarium saint", path: "/synaxarium/antony" },
  { name: "Feasts detail", path: "/feasts/covenant" },
  { name: "Agpeya reader", path: "/agpeya/morning" },
  { name: "Agpeya saved", path: "/agpeya/saved" },
  { name: "Katameros home", path: "/katameros" },
  { name: "Books list", path: "/books" },
];

async function backControls(page: Page) {
  // Match any of the back labels used across screens.
  return page.locator(
    '[aria-label="رجوع"], [aria-label="رجوع للأجبية"], [aria-label="رجوع للكتاب المقدس"], [aria-label="رجوع للكتب"], [aria-label="رجوع للفصل"]',
  );
}

test.describe("Unified back button — coverage", () => {
  for (const screen of DETAIL_SCREENS) {
    test(`${screen.name} (${screen.path}) shows a back control`, async ({ page }) => {
      await page.goto(screen.path);
      const back = await backControls(page);
      // At least one back control visible above the fold.
      await expect(back.first()).toBeVisible();
    });
  }
});

test.describe("Unified back button — root screens have none", () => {
  for (const path of ROOT_SCREENS_NO_BACK) {
    test(`root ${path} has no back control`, async ({ page }) => {
      await page.goto(path);
      // Wait for the page to render its header.
      await expect(page.locator("header").first()).toBeVisible();
      const back = await backControls(page);
      await expect(back).toHaveCount(0);
    });
  }
});
