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
  private readonly StatementLink: Locator;

  constructor(private readonly page: Page) {
    this.WelcomeHeading = page.getByRole('heading', { level: 1 });
    this.AreaBadge = page.locator('.area-badge');
    this.HoldingRows = page.locator('//ul[@class="holdings-list"]/li');
    this.FirstHoldingName = page.locator('//ul[@class="holdings-list"]/li[1]/div/p[1]');
    this.FirstHoldingMeta = page.locator('//ul[@class="holdings-list"]/li[1]/div/p[2]');
    this.NoHoldingsMessage = page.getByText('No holdings remaining');
    this.Balance = page.locator("[data-testid='account-balance']");
    this.LogOutButton = page.getByRole('button', { name: 'Log Out' });
    this.StatementLink = page.getByRole('link', { name: 'View statement' });
  }


    public welcomeText() {
        return this.WelcomeHeading;
    }

    public areaText() {
        return this.AreaBadge;
    }

    public balanceText() {
        return this.Balance;
    }

    public holdingCount() {
        return this.HoldingRows;
    }

    public firstHoldingName() {
        return this.FirstHoldingName;
    }

    public firstHoldingMeta() {
        return this.FirstHoldingMeta;
    }

    public noHoldingsText() {
        return this.NoHoldingsMessage;
    }

    /** position is 1-based: 1 = first holding on the page. */
    public clickSell(position: number) {
        this.page.click(`(//a[@role='button'])[${position}]`);
    }

    public logOut() {
        this.LogOutButton.click();
    }

    public openStatementLink() {
        this.StatementLink.click();
    }
}
