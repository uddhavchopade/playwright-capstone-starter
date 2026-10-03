import { test, expect } from "../fixtures";
import { SellPage } from "../pages/SellPage";
import { DashboardPage } from "../pages/DashboardPage";
import { ConfirmationPage } from "../pages/ConfirmationPage";

// All five tests open the sell form for the first holding, "Bluechip Growth Fund".
// The sell form has two groups of radio buttons (Market and Settlement type), a quantity,
// a confirmation checkbox and a "Submit for Redemption" button.

// Selenium: SellTests.sellCashOnNse
//   Choose market NSE, settlement Cash, quantity 1, confirm, submit.
//   Expect the confirmation heading "Transaction submitted and under process",
//   the status "processing" and the settlement "cash".
test("07 Selling on NSE with cash settlement is confirmed", async ({
  page,
  loggedInPage,
}) => {
  const sellPage = new SellPage(page);
  const dashboardPage = new DashboardPage(page);

  await dashboardPage.clickSell(1);
  await sellPage.chooseMarket("NSE");
  await sellPage.chooseSettlement("Cash");
  await sellPage.enterQuantity("1");
  await sellPage.confirmDetails();
  await sellPage.submit();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Transaction submitted and under process",
  );
  await expect(page.getByTestId("transaction-status")).toHaveText("processing");
  await expect(
    page.getByText("Settlement").locator("+dd"),
  ).toHaveText("cash");
});

// Selenium: SellTests.chequeNeedsBranch
//   Choose Cheque, quantity 1, confirm, submit, without filling in a branch.
//   Expect the alert "Cheque settlement requires a branch" and to stay on the sell page.
test("08 Cheque settlement without a branch is rejected", async ({
  page,
  loggedInPage,
}) => {
  const sellPage = new SellPage(page);
  const dashboardPage = new DashboardPage(page);

  await dashboardPage.clickSell(1);
  await sellPage.chooseMarket("NSE");
  await sellPage.enterQuantity("1");
  await sellPage.chooseSettlement("Cheque");
  await sellPage.confirmDetails();
  await sellPage.submit();

  await expect(sellPage.errorText).toHaveText(
    "Cheque settlement requires a branch",
  );
  await expect(page).toHaveURL(/sell/);
});

// Selenium: SellTests.chequeWithBranchConfirms
//   Choose NSE and Cheque, branch "Fort, Mumbai", quantity 1, confirm, submit.
//   Expect the settlement "cheque" and the status "processing".
test("09 Cheque settlement with a branch is confirmed", async ({
  page,
  loggedInPage,
}) => {
  const sellPage = new SellPage(page);
  const dashboardPage = new DashboardPage(page);
  const confirmationPage = new ConfirmationPage(page);

  await dashboardPage.clickSell(1);
  await sellPage.chooseMarket("NSE");
  await sellPage.enterQuantity("1");
  await sellPage.chooseSettlement("Cheque");
  await sellPage.enterChequeBranch("Fort, Mumbai");
  await sellPage.confirmDetails();
  await sellPage.submit();

  await expect(confirmationPage.statusText).toHaveText("processing");
  await expect(confirmationPage.settlementText).toHaveText("cheque");
});

// Selenium: SellTests.oversellIsRejected
//   Quantity 9999, confirm, submit. Expect an alert like "Only 120 units available to sell".
//   The number depends on the account, so match the shape of the sentence.
test("10 Selling more than is held is rejected", async ({
  page,
  loggedInPage,
}) => {
  const sellPage = new SellPage(page);
  const dashboardPage = new DashboardPage(page);

  await dashboardPage.clickSell(1);
  await sellPage.chooseMarket("NSE");
  await sellPage.enterQuantity("9999");
  await sellPage.confirmDetails();
  await sellPage.submit();
  
  await expect(sellPage.errorText).toHaveText(
    "Only 120 units available to sell",
  );
});

// Selenium: SellTests.saleReducesQuantityOnServer
//   Ask the API for the holding's quantity, sell 2 through the UI, ask the API again,
//   expect the quantity to be 2 lower. Playwright's request fixture replaces the Java HttpClient.
test("11 A sale reduces the quantity held on the server", async ({
  page,
  loggedInPage,
  api,
}) => {
  const sellPage = new SellPage(page);
  const dashboardPage = new DashboardPage(page);
  const confirmation = new ConfirmationPage(page);

  const accountId = loggedInPage.account.accountId;
  const before = await api
    .get(`/api/account/${accountId}`)
    .then((res) => res.json())
    .then(
      (data) =>
        data.account.holdings.find(
          (h: any) => h.name === "Bluechip Growth Fund",
        ).quantity,
    );

  await dashboardPage.clickSell(1);
  await sellPage.chooseMarket("NSE");
  await sellPage.chooseSettlement("Cash");
  await sellPage.enterQuantity("1");
  await sellPage.confirmDetails();
  await sellPage.submit();
  
  await expect(confirmation.headingText).toHaveText(
    "Transaction submitted and under process",
  );
  const after = await api
    .get(`/api/account/${accountId}`)
    .then((res) => res.json())
    .then(
      (data) =>
        data.account.holdings.find(
          (h: any) => h.name === "Bluechip Growth Fund",
        ).quantity,
    );
  await expect(after).toBe(before - 1);
});
