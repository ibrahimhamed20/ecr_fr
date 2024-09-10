import { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

export async function performLogin(page: Page, email: string, password: string) {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(email, password);
}