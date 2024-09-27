import { test, expect } from "@playwright/test";
import { getEnvVar } from "../utils/env";

// This test is failing on my side because I do not have test account that is setup to disable Captcha
test.skip("login to admin page", async ({ page }) => {
    await page.goto("/");
  
    //Type credentials
    await page.locator('[name="email input"]').fill(getEnvVar('USERNAME'));
    await page.locator('[for="admin-login-password"]').fill(getEnvVar('PASSWORD'));
  
    // Click the login button.
    await page.getByRole("button", { name: "Log in" }).click();
  
    await page.waitForSelector("#main_top");
    const responsePromise = await page.waitForResponse((response) => {
      return (
        response.url().includes("https://api.dashboard.moralis.io/user") &&
        response.status() === 200
      );
    });
    const response = await responsePromise.json();
    const userFullName = response.name;
  
    // Expects page to have a heading with the name of User.
    const headerLocator = await page
      .locator('[data-testid="test-typography"]')
      .first();
    await expect(
      headerLocator.filter({ hasText: `Welcome ${userFullName}` })
    ).toBeVisible();
  });