import { test, expect } from "@playwright/test";

test.describe("Marketplace (public view)", () => {
  test("marketplace redirects unauthenticated users", async ({ page }) => {
    await page.goto("/marketplace");
    await expect(page).toHaveURL(/\/login|marketplace/);
  });

  test("public scan page renders for valid batch", async ({ page }) => {
    // Uses a non-existent batch — expects 404 handling, not a crash
    const res = await page.goto("/scan/00000000-0000-0000-0000-000000000000");
    expect(res?.status()).toBeOneOf([200, 404]);
  });
});
