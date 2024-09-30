import { test, expect } from "@playwright/test";
import { getEnvVar, setEnvVar } from "../utils/env";
import { rpcETHMethod } from "../utils/rpcUtils";
import {setTokenToLocalStorage} from "../utils/authTokenUtils"
require("dotenv").config();
test.describe.configure({ mode: 'serial' });

const nodeURL = `https://site1.moralis-nodes.com/eth/${getEnvVar("NODE_KEY")}`;
// This test is failing on my side because I do not have test account that is setup to disable Captcha
test.skip("login to admin page", async ({ page }) => {
  await page.goto("/");

  //Type credentials
  await page.locator('[name="email input"]').fill(getEnvVar("USERNAME"));
  await page
    .locator('[for="admin-login-password"]')
    .fill(getEnvVar("PASSWORD"));

  // Click the login button.
  await page.getByRole("button", { name: "Log in" }).click();
  const responseLogin = await page.waitForResponse((response)=> {
    return (
      response.url().includes("https://api.dashboard.moralis.io/auth/login") &&
      response.status() === 201
    );
  })
  const loginResponseBody = await responseLogin.json()
    // Write auth token to .env file
    setEnvVar("AUTH_TOKEN", loginResponseBody.access_token);

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
// Login directly by injecting auth token to local storage 
test("click on nodes nav button and create new ETH node", async ({ page }) => {
  await page.goto("/");
  await setTokenToLocalStorage(page)
  await page.goto("/nodes");
  await page.waitForSelector("#main_top");
  await page.getByRole("button", { name: "Create a New Node" }).click();
  await expect(page.locator(".mui-modal")).toBeVisible();
  await page
    .getByRole("heading", { name: "Start creating your node" })
    .isVisible();
  await page.locator("#select-protoccol").selectOption({ value: "Ethereum" });
  await page.locator("#select-network").selectOption({ value: "0x1-Mainnet" });
  await page.getByRole("heading", { name: "Node information" }).isVisible();
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
  setEnvVar("NODE_KEY", response.key);
});

test("positive scenario for blockNumber, getBlockByNumber, getTransactionByHash", async () => {
  // blockNumber with checking basic structure of ETH JSON-RPC API
  const responseBlockNumber = await rpcETHMethod(nodeURL, "eth_blockNumber");
  expect(responseBlockNumber).toEqual(
    expect.objectContaining({
      jsonrpc: "2.0",
      id: 1,
      result: expect.stringContaining("0x"),
    })
  );
  // Store latest block for getBlockByNumber
  const blockNumber = responseBlockNumber.result;
  // getBlockByNumber with checking only hashes of transaction
  const responseGetBlock = await rpcETHMethod(nodeURL, "eth_getBlockByNumber", [
    blockNumber,
    false,
  ]);
    // Store block hash and  first displayed transaction in the latest block
  const blockHash = responseGetBlock.result.hash
  const txHash = responseGetBlock.result.transactions[0];
  expect(typeof responseGetBlock.result.transactions[0] === "string");
    // getTransactionByHash
    const responseGetTransaction = await rpcETHMethod(nodeURL, "eth_getTransactionByHash", [txHash]);
    // Verify that block number and hash are matching to previous requests, and that object contains from and to keys 
    expect(responseGetTransaction.result).toEqual(
      expect.objectContaining({
        hash: txHash,
        blockHash: blockHash,
        blockNumber: blockNumber
      })
    )
  });


test("positive scenario for RPC getBlockByNumber (latest block) full transaction object", async () => {
  // Fetch latest block from eth_blockNumber result
  const responseBlockNumber = await rpcETHMethod(
    nodeURL,
    "eth_blockNumber",
    []
  );
  // Call getBlockByNumber from latest block with full transaction object
  const responseGetBlock = await rpcETHMethod(nodeURL, "eth_getBlockByNumber", [
    responseBlockNumber.result,
    true,
  ]);
  expect(typeof responseGetBlock.result.transactions[0] === "object");
  expect(responseGetBlock.result.transactions[0]).toEqual(
    expect.objectContaining({
      from: expect.any(String),
      to: expect.any(String),
    })
  );
});

test('negative scenario: wrong method', async()=> {
  const notEthMethod = "notEthMethod"
  const response = await rpcETHMethod(nodeURL, notEthMethod)
  expect(response).toEqual(expect.objectContaining({
    code: 400,
    message: `'${notEthMethod}' is not supported on chain eth`
  }))
})

test('negative scenario: wrong param', async()=> {
  const response = await rpcETHMethod(nodeURL, "eth_getTransactionByHash", [11])
  expect(response.error.message === "Invalid params")  
})

test('delete node and try rpc with deleted key', async({page})=> {
  await page.goto("/");
  await setTokenToLocalStorage(page)
  await page.goto("/nodes");
  await page.waitForSelector("#main_top");

})