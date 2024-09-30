# moralisAutmoationTask 🎭
This project is a demonstration of my ability to create, organize, and execute UI and API tests using Playwright on https://admin.moralis.com/

## Run Playwright tests

### Project Structure
```
.
├── tests
│   ├── getWalletNFTs.spec.ts             # Test cases related to API Keys https://docs.moralis.com/web3-data-api/evm/reference/wallet-api/get-nfts-by-wallet
│   └── nodeCreateAndExecuteRPC.spec.ts   # Test cases related to sending ETH API request via moralis node (blockNumber, getBlockByNumber, getTransactionByHash)
├── utils
│       ├── apiUtils.ts                   # Reusable axios client for API requests
│       ├── authTokenUtils.ts             # Reusable function that set localStorage.setItem with token 
│       ├── env.ts                        # env.ts getEnvVar for fetching dotenv files and setEnvVar to write AUTH_TOKEN, NODE_KEY, API_KEY based on specific user
│       └── rpcUtils.ts                   # Reusable fetch client for RPC requests 
├── playwright.config.ts                  # Playwright configuration file
├── package.json                          # Project dependencies and scripts
├── .env                                  # Environment variables (rename .env.example and put your USERNAME and PASSWORD
└── README.md                             # This documentation file
```
### Setup Instructions

1. Start by cloning the repo and installing the dependencies:

```bash
git clone https://github.com/ivanori1/moralisAutmoationTask.git
cd moralisAutmoationTask
```
2. Install Dependencies:
- Ensure you have latest Node.js installed. Then run:
```bash
npm install
```
3. Set Up Environment Variables:
- fill the Copy the <mark>.env.example</mark> file to <mark>.env</mark>:
```bash
cp .env.example .env
```
or just remove .example after adding <mark>USERNAME</mark> and <mark>PASSWORD</mark>

4. Run the Tests:
- Use the [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) to run the tests in the tests folder from VS Code or run the following command in the terminal:

```bash
npx playwright test --ui
```

### Extra explanation

- setTokenToLocalStorage is unstable, sometimes it works, sometimes app return https://admin.moralis.com/verify with image of help (because Captcha is force bypassed)
![alt failed login with auth token](https://drive.google.com/uc?id=1KMdH2QKv2G1ko9a-AepJnrWbfMhd-CUw)
and sometimes it is just redirected back to login page.
But the point of this test is to show my approach, so external testing can be unstable, but internal company testing will setup no Captcha and maybe some auth token that will last long (at least that is what I was doing in previous projects).
- rpcETHMethodRequest is working only in headless mode but not in --ui tests, so rewriting this function with axios library would help.

### **Conclusion**: Please focus on the structure of the code and we can discuss every aspect and ideas behind my approach on the tech interview

