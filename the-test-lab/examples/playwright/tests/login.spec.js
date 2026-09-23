const { test, expect } = require('@playwright/test');

test.describe('Login flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pages/login.html');
  });

  test('valid user reaches the secure page', async ({ page }) => {
    await page.getByTestId('username').fill('testuser');
    await page.getByTestId('password').fill('Test@123');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page).toHaveURL(/secure\.html/);
    await expect(page.getByTestId('welcome-msg')).toHaveText('Welcome back, testuser!');
  });

  test('wrong password shows an error', async ({ page }) => {
    await page.getByTestId('username').fill('testuser');
    await page.getByTestId('password').fill('wrong');
    await page.getByTestId('login-btn').click();

    await expect(page.getByTestId('login-error')).toContainText('Invalid username or password');
  });

  test('locked account is rejected', async ({ page }) => {
    await page.getByTestId('username').fill('locked');
    await page.getByTestId('password').fill('Test@123');
    await page.getByTestId('login-btn').click();

    await expect(page.getByTestId('login-error')).toContainText('locked');
  });
});
