const { test, expect } = require('@playwright/test');

test('fills and submits the registration form', async ({ page }) => {
  await page.goto('/pages/forms.html');
  await page.getByLabel('First name').fill('Jane');
  await page.getByLabel('Last name').fill('Doe');
  await page.getByLabel('Email address').fill('jane@example.com');
  await page.locator('#password').fill('Secret@123');
  await page.locator('#confirmPassword').fill('Secret@123');
  await page.getByTestId('terms').check();
  await page.getByTestId('submit-btn').click();

  await expect(page.getByTestId('success-message')).toHaveText('Account created for Jane Doe');
});

test('handles a JavaScript prompt', async ({ page }) => {
  await page.goto('/pages/alerts.html');
  page.once('dialog', dialog => dialog.accept('Playwright'));
  await page.getByTestId('prompt-btn').click();
  await expect(page.getByTestId('dialog-result')).toHaveText('Hello, Playwright!');
});

test('types inside a nested iframe', async ({ page }) => {
  await page.goto('/pages/frames.html');
  const inner = page.frameLocator('#outerFrame').frameLocator('#innerFrame');
  await inner.locator('#innerInput').fill('hello');
  await inner.locator('#innerBtn').click();
  await expect(page.getByTestId('frame-result')).toContainText('hello');
});

test('drags an item to the drop zone', async ({ page }) => {
  await page.goto('/pages/drag-drop.html');
  await page.locator('#draggable').dragTo(page.locator('#droppable'));
  await expect(page.locator('#droppable')).toContainText('Dropped!');
});

test('waits for data to load', async ({ page }) => {
  await page.goto('/pages/waits.html');
  await page.getByTestId('load-data-btn').click();
  await expect(page.getByTestId('loaded-data')).toBeVisible();
});

test('switches to a new tab', async ({ page, context }) => {
  await page.goto('/pages/windows.html');
  const [newPage] = await Promise.all([context.waitForEvent('page'), page.getByTestId('new-tab-btn').click()]);
  await expect(newPage.getByTestId('child-heading')).toHaveText('This is a new window');
});

test('sorts and pages the employee table', async ({ page }) => {
  await page.goto('/pages/tables.html');
  await page.getByTestId('page-size').selectOption('5');
  await page.getByTestId('next-page').click();
  await expect(page.getByTestId('page-info')).toHaveText(/Showing 6–10/);
});

test('reaches into shadow DOM', async ({ page }) => {
  await page.goto('/pages/shadow-dom.html');
  await page.locator('#shadowEmail').fill('me@example.com');
  await page.locator('#shadowSubmit').click();
  await expect(page.getByTestId('shadow-result')).toContainText('me@example.com');
});
