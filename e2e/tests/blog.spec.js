const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith } = require('./helpers');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Kai',
        username: 'kai',
        password: 'super',
      },
    });
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    const login = page.getByRole('heading', { name: 'log in to applicaton' });
    await expect(login).toBeVisible();
    await expect(page.locator('input[name="Username"]')).toBeVisible();
    await expect(page.locator('input[name="Password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible();
  });

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'kai', 'super');
      await expect(page.getByText('Kai successfully logged in')).toBeVisible();
    });

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'kai', 'wrong');

      const errorDiv = page.locator('.isError');
      await expect(errorDiv).toContainText('invalid username or password');
      await expect(errorDiv).toHaveCSS('border-style', 'solid');
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)');
      await expect(
        page.getByText('Kai successfully logged in')
      ).not.toBeVisible();
    });
  });
});
