import { test, expect } from '../fixtures';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';

// Selenium: IsolationTests.seededAccountStartsClean
//   Creates an account through the API, logs in as it through the login page, and checks:
//   the welcome text, 3 holdings and the balance "₹1,25,000.50".
test('12 A freshly seeded account starts with the default holdings and balance', async ({page, createAccount }) => {
        const account = createAccount();
        const loginPage = new LoginPage(page);
        const dashboard = new DashboardPage(page);
        const username = (await account).username;
        const password = (await account).password;

        await loginPage.open();
        await loginPage.login("Retail Banking", username, password);

        await expect(dashboard.welcomeText).toHaveText("Welcome, " + (await account).username);
        await expect(dashboard.holdingCount).toHaveCount(3);
        await expect(dashboard.balanceText).toHaveText("₹1,25,000.50");
});
