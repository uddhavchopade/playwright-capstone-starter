import { type Page, expect, Locator } from "@playwright/test";

export class ConfirmationPage {
  private readonly Heading: Locator;
  private readonly Status: Locator;
  private readonly Settlement: Locator;
  private readonly Quantity: Locator;

  constructor(private readonly page: Page) {
    this.Heading = page.locator("[data-testid='confirmation-heading']");
    this.Status = page.locator("[data-testid='transaction-status']");
    this.Settlement = page.getByText("Settlement").locator("+dd");
    this.Quantity = page.getByText("Quantity").locator("+dd");
  }

  get headingText() {
    return this.Heading;
  }

  get statusText() {
    return this.Status;
  }

  get settlementText() {
    return this.Settlement;
  }

  get quantityText() {
    return this.Quantity;
  }
}
