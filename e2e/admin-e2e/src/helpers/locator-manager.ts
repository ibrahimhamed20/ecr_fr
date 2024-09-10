import { Page, Locator } from '@playwright/test';

export class LocatorManager {

    constructor(private page: Page) { }

    getLocator(selector: string): Locator {
        return this.page.locator(selector);
    }

    getElementById(id: string) {
        return this.page.locator(`#${id}`);
    }

    getButtonByText(text: string): Locator {
        return this.page.locator(`button:has-text("${text}")`);
    }

    getInputByName(name: string): Locator {
        return this.page.locator(`input[name="${name}"]`);
    }

    getElementByTestId(testId: string): Locator {
        return this.page.locator(`[data-testid="${testId}"]`);
    }
}