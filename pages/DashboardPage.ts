import { type Page, expect, Locator } from '@playwright/test';

export class DashboardPage {
  private readonly WelcomeHeading: Locator;
  private readonly AreaBadge: Locator;
  private readonly HoldingRows: Locator;
  private readonly FirstHoldingName: Locator;
  private readonly FirstHoldingMeta: Locator;
  private readonly NoHoldingsMessage: Locator;
  private readonly Balance: Locator;
  private readonly LogOutButton: Locator;

  constructor(private readonly page: Page) {
    this.WelcomeHeading = page.getByRole('heading', { level: 1 });
    this.AreaBadge = page.locator('.area-badge');
    this.HoldingRows = page.locator('.holdings-list li');
    this.FirstHoldingName = page.locator('.holdings-list li:nth-child(1) div p:first-child');
    this.FirstHoldingMeta = page.locator('.holdings-list li:nth-child(1) div p:last-child');
    this.NoHoldingsMessage = page.getByText('No holdings remaining');
    this.Balance = page.locator("[data-testid='account-balance']");
    this.LogOutButton = page.getByRole('button', { name: 'Log Out' });
  }


    get welcomeText() {
        return this.WelcomeHeading;
    }

    get areaText() {
        return this.AreaBadge;
    }

    get balanceText() {
        return this.Balance;
    }

    get holdingCount() {
        return this.HoldingRows;
    }

    get firstHoldingName() {
        return this.FirstHoldingName;
    }

    get firstHoldingMeta() {
        return this.FirstHoldingMeta;
    }

    get noHoldingsText() {
        return this.NoHoldingsMessage;
    }

    /** position is 1-based: 1 = first holding on the page. */
    async clickSell(position: number) {
        await this.page.getByRole('button', { name: 'Sell / Redeem' }).nth(position - 1).click();
    }


    async logOut() {
        await this.LogOutButton.click();
    }
}
