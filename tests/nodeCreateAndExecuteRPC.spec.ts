import { test, expect } from "@playwright/test";
import { getEnvVar,setEnvVar } from "../utils/env";
require('dotenv').config();

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

  test("click on nodes nav button and create new ETH node", async({page})=> {

   await page.goto("/");
   // Define the authStore object
   const authStore = {
    
      state: {
          hasMarketingSubscribe: false,
          hasTermsAndConditions: true,
          token: getEnvVar('AUTH_TOKEN'), // somehow it is not wokring and I am for now using direct AUTH token 
          keepLoggedIn: false
      },
      version: 0
      
   };
   // Set the authStore into localStorage
   await page.evaluate((authStore) => {
     localStorage.setItem("authStore", JSON.stringify(authStore));
   }, authStore);
  
   await page.goto('/nodes')
   await page.getByRole("button", { name: "Create a New Node" }).click();
   await expect(page.locator(".mui-modal")).toBeVisible();
   await page.getByRole("heading", { name: "Start creating your node" }).isVisible()
   await page.locator("#select-protoccol").selectOption({value:'Ethereum'})
   await page.locator("#select-network").selectOption({value:'0x1-Mainnet'})
   await page.getByRole("heading", { name: "Node information" }).isVisible()
   await expect(page.getByRole("img", { name: "Ethereum" })).toBeVisible();
   await page.getByRole("button", { name: "Create Node" }).click();

  // Get NODE keys and store in .env file 
  const responsePromise = await page.waitForResponse((response) => {
    return (
      response
        .url()
        .includes("https://api.dashboard.moralis.io/project/nodes") &&
      response.status() === 201
    );
  });
  const response = await responsePromise.json();
  // Write node key to .env file 
  setEnvVar('NODE_KEY', response.key)
  })