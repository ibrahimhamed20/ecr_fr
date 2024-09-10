import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/dashboard.page';

test.describe('Dashboard Tests', () => {
    test.beforeEach(async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.goto();
    });

    test('should display user statistics', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await expect(dashboardPage.userStats).toBeVisible();
    });
});