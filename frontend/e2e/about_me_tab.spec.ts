import { test, expect } from "@playwright/test";

const FE = process.env.CONDUIT_FRONTEND_URL || "http://localhost:3000";

test.describe("User / AboutMeTab", () => {
  test("about_me_tab_navigates", async ({ page }) => {
    await page.goto(`${FE}/#/profile/alice`, { waitUntil: "domcontentloaded" });
    const aboutMeNavLink = page.locator("a", { hasText: "About Me" }).first();
    await aboutMeNavLink.waitFor({ timeout: 10_000 });
    await expect(aboutMeNavLink).toBeVisible();
  });

  test("about_me_content_renders", async ({ page }) => {
    await page.goto(`${FE}/#/profile/alice`, { waitUntil: "domcontentloaded" });
    const aboutMeTab = page.locator("a", { hasText: "About Me" }).first();
    await aboutMeTab.waitFor({ timeout: 10_000 });
    await aboutMeTab.click();

    const usernameElement = page.getByText("alice", { exact: true }).first();
    await usernameElement.waitFor({ timeout: 10_000 });
    await expect(usernameElement).toBeVisible();

    const avatarImage = page.locator("img.avatar").first();
    await avatarImage.waitFor({ timeout: 10_000 });
    await expect(avatarImage).toBeVisible();
  });
});