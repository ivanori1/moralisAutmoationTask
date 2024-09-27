# moralisAutmoationTask 🎭
This project is a demonstration of my ability to create, organize, and execute UI and API tests using Playwright on https://admin.moralis.com/

## Run Playwright tests
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



