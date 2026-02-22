import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
    test('should show error for invalid credentials', async ({ page }) => {
        await page.goto('/login');

        // Fill in credentials using actual placeholders from src/app/login/page.tsx
        await page.getByPlaceholder('Unesite korisničko ime').fill('wronguser');
        await page.getByPlaceholder('••••••••').fill('wrongpassword');

        // Click login button with actual text
        await page.getByRole('button', { name: 'Pristupite portalu' }).click();

        // Check for error message
        // Note: The specific error message depends on what the API returns, 
        // but "Prijava nije uspela" is a fallback in page.tsx
        const errorMsg = page.locator('div.bg-red-100');
        await expect(errorMsg).toBeVisible();
    });

    test('should navigate to registration from login', async ({ page }) => {
        await page.goto('/login');
        await page.getByRole('link', { name: 'Registrujte se ovde' }).click();
        await expect(page).toHaveURL(/\/register/);
    });

    test('should have FON raspored branding', async ({ page }) => {
        await page.goto('/login');
        await expect(page.getByText('FON raspored')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Prijavi se' })).toBeVisible();
    });
});
