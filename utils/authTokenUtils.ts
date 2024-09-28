import { Page } from '@playwright/test';

// Helper function to set the authStore in localStorage
export async function setTokenToLocalStorage(page: Page) {
  const authStore = {
    state: {
        hasMarketingSubscribe: false,
        hasTermsAndConditions: true,
        token: process.env.AUTH_TOKEN,
        keepLoggedIn: false,
      },
      version: 0,
  };
  await page.evaluate((authStore) => {
    localStorage.setItem("authStore", JSON.stringify(authStore));
  }, authStore);
}
