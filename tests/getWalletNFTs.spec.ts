import { test, expect } from "@playwright/test";
import { setTokenToLocalStorage } from "../utils/authTokenUtils";
import { getEnvVar, setEnvVar } from "../utils/env";
import dotenv from "dotenv";
import { fetchNftData } from "../utils/apiUtils";

dotenv.config(); // Load environment variables from .env file
const address = "0xf9da4Cc097BDCa1139a72a26ccBb2ef977A55343";
const apiKey = getEnvVar("API_KEY");

require("dotenv").config();
test.describe.configure({ mode: "serial" });

// Login directly by injecting auth token to local storage
test("open home page and fetch api keys from /secret endpoint", async ({
  page,
}) => {
  await page.goto("/");
  await setTokenToLocalStorage(page);
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
  await page.locator('[data-testid="mui-showhide"]').click();
  const apiInput = await page.locator('[data-testid="mui-card"] [type="text"]');
  await expect(apiInput).toHaveAttribute("value", response[0].secret);
});
// for more detail on how to use https://docs.moralis.com/web3-data-api/evm/reference/wallet-api/get-nfts-by-wallet
test("check api request on polygon Get NFTs by wallet", async () => {
  const queryParams = {
    chain: "polygon",
    format: "decimal",
    limit: 3,
    exclude_spam: true,
    media_items: false,
  };
  const response = await fetchNftData(apiKey, address, queryParams);
  expect(response.status).toBe(200);
  expect(response.data).toBeDefined();
  // length of the displayed objects to be equal or less to limit
  expect(response.data.result.length).toBeLessThanOrEqual(queryParams.limit);
});

test("check api request with wrong address", async () => {
  const wrongAddress = address + "1";

  await expect(fetchNftData(apiKey, wrongAddress)).rejects.toThrow(
    "Request failed with status code 400"
  );
});

test("check api request with invalid chain", async () => {
  const queryParams = {
    chain: "ivan"
  }
  await expect(fetchNftData(apiKey, address, queryParams)).rejects.toThrow(
    "Request failed with status code 400"
  );
});
