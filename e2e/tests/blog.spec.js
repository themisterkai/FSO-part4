const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helpers');

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

  describe('When logged in', () => {
    const title1 = 'blog 1';
    const author1 = 'author 1';
    const title2 = 'blog 2';
    const title3 = 'blog 3';

    beforeEach(async ({ page }) => {
      await loginWith(page, 'kai', 'super');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, title1, author1, 'url1.com');
    });

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'blog 1', author1, 'url1.com');
      });

      test('blog can be liked', async ({ page }) => {
        const blog = page.locator(`div.blog:has-text("${title1}")`);
        await blog.getByRole('button', { name: 'view' }).click();
        await blog.getByRole('button', { name: 'like' }).click();
        await blog.getByText('1 like').waitFor();
      });

      test.only('blog can be deleted', async ({ page }) => {
        const blog = page.locator(`div.blog:has-text("${title1}")`);
        await blog.getByRole('button', { name: 'view' }).click();
        page.on('dialog', async dialog => {
          await dialog.accept(); // Accept the confirmation dialog
        });
        await blog.getByRole('button', { name: 'remove' }).click();
        await expect(blog).not.toBeVisible();
        await page.getByText(`${title1} by ${author1} removed`).waitFor();
      });
    });
  });
});
