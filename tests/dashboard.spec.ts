import { test, expect } from "../fixtures";
import { DashboardPage } from "../pages/DashboardPage";

// Selenium: DashboardTests.dashboardListsHoldings
//   Logs in as the shared demo account, then checks: 3 holdings, the first one is
//   "Bluechip Growth Fund", and its details start with "NSE".
test("04 Dashboard lists the holdings for the account", async ({
  page,
  loggedInPage,
}) => {
  const dashboard = new DashboardPage(page);

  await expect(dashboard.holdingCount).toHaveCount(3);
  await expect(dashboard.firstHoldingName).toHaveText("Bluechip Growth Fund");
  await expect(dashboard.firstHoldingMeta).toHaveText(/NSE/);
});

// Selenium: DashboardTests.emptyAccountShowsMessage
//   Logs in as the account "emptyholder" and expects the text "No holdings remaining."
//   and zero holdings. Playwright can create an account that has no holdings on demand.
test("05 An account with no holdings shows the empty message", async ({
  page,
  loggedInPageWithZeroHoldings,
}) => {
  const dashboard = new DashboardPage(page);

  await expect(dashboard.noHoldingsText).toHaveText("No holdings remaining.");
  await expect(dashboard.holdingCount).toHaveCount(0);
});
