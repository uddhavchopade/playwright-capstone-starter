import { type Page, expect, Locator } from '@playwright/test';

export class SellPage {
    private readonly QuantityField: Locator;
    private readonly ChequeBranchField: Locator;
    private readonly ConfirmCheckbox: Locator;
    private readonly SubmitButton: Locator;
    private readonly ErrorMessage: Locator;

  constructor(private readonly page: Page) {
    this.QuantityField = page.getByRole('spinbutton', { name: 'Quantity to sell' });
    this.ChequeBranchField = page.getByRole('textbox', { name: 'Cheque branch' });
    this.ConfirmCheckbox = page.getByRole('checkbox', { name: 'I confirm the above details' });
    this.SubmitButton = page.getByRole('button', { name: 'Submit for Redemption' });
    this.ErrorMessage = page.getByRole('alert');
  }

   /** market is the visible label: "NSE" or "BSE". */
    async chooseMarket(market : string) {
        return this.page.getByRole('radio', { name: market }).click();
    }

    /** settlement is the visible label: "Cash" or "Cheque". */
    async chooseSettlement(settlement : string) {
        return this.page.getByRole('radio', { name: settlement }).click();
    }

    async enterQuantity(quantity : string) {
        return this.QuantityField.fill(quantity);
    }

    async enterChequeBranch(branch : string) {
        return this.ChequeBranchField.fill(branch);
    }

    async confirmDetails() {
        return this.ConfirmCheckbox.check();
    }

    async submit() {
        return this.SubmitButton.click();
    }

    get errorText() {
        return this.ErrorMessage;
    }
}


