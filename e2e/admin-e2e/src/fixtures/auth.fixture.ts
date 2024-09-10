import { test as base, Page } from '@playwright/test';
import { performLogin } from '../helpers/login.helper';

type AuthFixtures = {
    authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
    authenticatedPage: async ({ page }, use) => {
        // Perform login before each test
        await performLogin(page, 'user@example.com', 'password123');

        // Use the authenticated page
        await use(page);
    },
});