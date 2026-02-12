import { test, expect } from '@playwright/test';

test.describe('RBAC Enforcement', () => {
    test('unauthenticated user should be redirected to login from student dashboard', async ({ page }) => {
        await page.goto('/student/dashboard');
        await expect(page).toHaveURL(/\/login/);
    });

    test('unauthenticated user should be redirected to login from admin dashboard', async ({ page }) => {
        await page.goto('/admin/dashboard');
        await expect(page).toHaveURL(/\/login/);
    });

    test('root /student should redirect to /student/dashboard (auth required)', async ({ page }) => {
        await page.goto('/student');
        await expect(page).toHaveURL(/\/login/);
    });
});
