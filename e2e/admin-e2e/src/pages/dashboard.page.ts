import { Page } from '@playwright/test';
import { LocatorManager } from '../helpers/locator-manager';

export class DashboardPage {
    private locatorManager: LocatorManager;

    constructor(private page: Page) {
        this.locatorManager = new LocatorManager(page);
    }

    async goto() {
        await this.page.goto('/dashboard');
    }

    get userStats() {
        return this.locatorManager.getElementByTestId('user-stats');
    }
}