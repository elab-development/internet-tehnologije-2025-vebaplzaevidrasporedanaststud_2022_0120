import { test, expect } from '@playwright/test';

test.describe('Registration Flow', () => {
    test('should show validation errors for empty fields', async ({ page }) => {
        await page.goto('/register');
        await page.getByRole('button', { name: 'Registruj se' }).click();

        // Browser native validation usually kicks in first because of 'required' attribute
        const usernameInput = page.getByPlaceholder('milovan_anic');
        const isInvalid = await usernameInput.evaluate((node: HTMLInputElement) => !node.checkValidity());
        expect(isInvalid).toBe(true);
    });

    test('should navigate back to login', async ({ page }) => {
        await page.goto('/register');
        await page.getByRole('link', { name: 'Prijavite se ovde' }).click();
        await expect(page).toHaveURL(/\/login/);
    });
});
