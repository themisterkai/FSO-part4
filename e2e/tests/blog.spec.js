const { test, expect, beforeEach, describe } = require('@playwright/test');
const { loginWith, createBlog } = require('./helpers');

describe('Blog app', () => {
  const title1 = 'blog 1';
  const author1 = 'author 1';
  const title2 = 'blog 2';
  const author2 = 'author 2';
  const title3 = 'blog 3';
  const author3 = 'author 3';

  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', {
      data: {
        name: 'Kai',
        username: 'kai',
        password: 'super',
      },
    });
    await request.post('/api/users', {
      data: {
        name: 'Other',
        username: 'other',
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
    beforeEach(async ({ page }) => {
      await loginWith(page, 'kai', 'super');
    });

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, title1, author1, 'url1.com');
    });

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, title1, author1, 'url1.com');
      });

      test('blog can be liked', async ({ page }) => {
        const blog = page.locator(`div.blog:has-text("${title1}")`);
        await blog.getByRole('button', { name: 'view' }).click();
        await blog.getByRole('button', { name: 'like' }).click();
        await blog.getByText('1 like').waitFor();
      });

      test('blog can be deleted', async ({ page }) => {
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

    describe('and several blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, title1, author1, 'url1.com');
        await createBlog(page, title2, author2, 'url2.com');
        await createBlog(page, title3, author3, 'url2.com');
      });

      test('blogs are ordered by likes', async ({ page }) => {
        const blog1 = page.locator(`div.blog:has-text("${title1}")`);
        await blog1.getByRole('button', { name: 'view' }).click();
        await blog1.getByRole('button', { name: 'like' }).click();
        await blog1.getByText('1 like').waitFor();

        const blog2 = page.locator(`div.blog:has-text("${title2}")`);
        await blog2.getByRole('button', { name: 'view' }).click();
        await blog2.getByRole('button', { name: 'like' }).click();
        await blog2.getByText('1 like').waitFor();
        await blog2.getByRole('button', { name: 'like' }).click();
        await blog2.getByText('2 like').waitFor();

        const blog3 = page.locator(`div.blog:has-text("${title3}")`);
        await blog3.getByRole('button', { name: 'view' }).click();
        await blog3.getByRole('button', { name: 'like' }).click();
        await blog3.getByText('1 like').waitFor();
        await blog3.getByRole('button', { name: 'like' }).click();
        await blog3.getByText('2 like').waitFor();
        await blog3.getByRole('button', { name: 'like' }).click();
        await blog3.getByText('3 like').waitFor();

        const blogs = page.locator('div.blog');
        await expect(blogs.nth(0)).toContainText(title3);
        await expect(blogs.nth(1)).toContainText(title2);
        await expect(blogs.nth(2)).toContainText(title1);
      });
    });
  });

  describe('A blog by another user exists', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'other', 'super');
      await createBlog(page, title1, author1, 'url1.com');
      await page.getByRole('button', { name: 'logout' }).click();
      await loginWith(page, 'kai', 'super');
    });

    test('blog added by another users cannot be deleted', async ({ page }) => {
      const blog = page.locator(`div.blog:has-text("${title1}")`);
      await blog.getByRole('button', { name: 'view' }).click();
      await expect(
        blog.getByRole('button', { name: 'remove' })
      ).not.toBeVisible();
    });

    test('blog by another users can be liked', async ({ page }) => {
      const blog = page.locator(`div.blog:has-text("${title1}")`);
      await blog.getByRole('button', { name: 'view' }).click();
      await blog.getByRole('button', { name: 'like' }).click();
      await blog.getByText('1 like').waitFor();
    });
  });
});
