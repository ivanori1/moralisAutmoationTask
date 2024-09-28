import { test, expect } from "@playwright/test";
import {setTokenToLocalStorage} from "../utils/authTokenUtils"
import { getEnvVar, setEnvVar } from "../utils/env";

require("dotenv").config();
test.describe.configure({ mode: 'serial' });

// Login directly by injecting auth token to local storage 
test("open home page and fetch api keys from /secret endpoint", async ({ page }) => {
  await page.goto("/");
  await setTokenToLocalStorage(page)
  await page.goto("/");
 // Get API keys and store in .env file
 const responsePromise = await page.waitForResponse((response) => {
    return (
      response
        .url()
        .includes("https://api.dashboard.moralis.io/project/secret") &&
      response.status() === 200
    );
  });
  const response = await responsePromise.json();
  // Write node key to .env file
  setEnvVar("API_KEY", response[0].secret);
  // compare API key to UI display of key
  await page.locator('[data-testid="mui-showhide"]').click()
const apiInput =   await page.locator('[data-testid="mui-card"] [type="text"]')
await expect(apiInput).toHaveAttribute('value', response[0].secret); 
});
