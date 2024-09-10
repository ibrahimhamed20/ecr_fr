import { Page } from '@playwright/test';
import { LocatorManager } from '../helpers/locator-manager';

export class LoginPage {
    private locatorManager: LocatorManager;

    constructor(private page: Page) {
        this.locatorManager = new LocatorManager(page);
    }

    async goto() {
        await this.page.goto('/login');
    }

    async login(email: string, password: string) {
        const emailInput = this.locatorManager.getInputByName('email');
        const passwordInput = this.locatorManager.getInputByName('password');
        const loginButton = this.locatorManager.getButtonByText('Login');

        await emailInput.fill(email);
        await passwordInput.fill(password);
        await loginButton.click();
    }

    get errorMessage() {
        return this.locatorManager.getLocator('.error-message');
    }
}