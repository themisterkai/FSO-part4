const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const rootUser = helper.rootUser;

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.multipleBlogs);
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash(rootUser.password, 10);
  const user = new User({ username: rootUser.username, passwordHash });
  await user.save();
});

describe('when there are blogs already saved', () => {
  test('blogs are returned as json', async () => {
    const login = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('blogs are stored with a unique id', async () => {
    const login = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(200);

    const ids = response.body.map(blog => blog.id);
    const idSet = new Set(ids);
    assert.strictEqual(ids.length, idSet.size);
  });
});

describe('adding a new blog', () => {
  test('a valid blog can be added', async () => {
    const login = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const newBlog = {
      title: 'new blog',
      author: 'new author',
      url: 'https://newblog.com',
      likes: 1,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.multipleBlogs.length + 1);

    const urls = blogsAtEnd.map(blog => blog.url);
    assert(urls.includes(newBlog.url));
  });

  test('sets likes to 0 if it was not set', async () => {
    const login = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const newBlog = {
      title: 'new blog',
      author: 'new author',
      url: 'https://newblog.com',
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test('fails with a 401 if no auth token is provided', async () => {
    const newBlog = {
      title: 'new blog',
      author: 'new author',
      url: 'https://newblog.com',
      likes: 1,
    };

    await api.post('/api/blogs').send(newBlog).expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.multipleBlogs.length);

    const urls = blogsAtEnd.map(blog => blog.url);
    assert(!urls.includes(newBlog.url));
  });

  test('returns a 400 bad request if the title is not set', async () => {
    const login = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const newBlog = {
      author: 'new author',
      url: 'https://newblog.com',
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(newBlog)
      .expect(400);
  });

  test('returns a 400 bad request if the url is not set', async () => {
    const login = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const newBlog = {
      title: 'new blog',
      author: 'new author',
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(newBlog)
      .expect(400);
  });
});

describe.only('deletion of a blog', async () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const login = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const newBlog = {
      title: 'new blog',
      author: 'new author',
      url: 'https://newblog.com',
      likes: 1,
    };

    const blogToDelete = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAfterAddition = await helper.blogsInDb();
    assert.strictEqual(
      blogsAfterAddition.length,
      helper.multipleBlogs.length + 1
    );

    await api
      .delete(`/api/blogs/${blogToDelete.body.id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.multipleBlogs.length);

    const urls = blogsAtEnd.map(blog => blog.url);
    assert(!urls.includes(blogToDelete.body.url));
  });

  test('fails with status code 401 if the user tries to delete a blog that they did not add', async () => {
    const newUser = {
      username: 'kai',
      password: 'super',
    };
    const passwordHash = await bcrypt.hash(newUser.password, 10);
    const user = new User({ username: newUser.username, passwordHash });
    await user.save();

    const login = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const login2 = await api
      .post('/api/login')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const newBlog = {
      title: 'new blog',
      author: 'new author',
      url: 'https://newblog.com',
      likes: 1,
    };

    const blogToDelete = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAfterAddition = await helper.blogsInDb();
    assert.strictEqual(
      blogsAfterAddition.length,
      helper.multipleBlogs.length + 1
    );

    await api
      .delete(`/api/blogs/${blogToDelete.body.id}`)
      .set('Authorization', `Bearer ${login2.body.token}`)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.multipleBlogs.length + 1);

    const urls = blogsAtEnd.map(blog => blog.url);
    assert(urls.includes(blogToDelete.body.url));
  });

  test('fails with status code 401 if the user tries to delete a blog with no user', async () => {
    const login = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.multipleBlogs.length);

    const urls = blogsAtEnd.map(blog => blog.url);
    assert(urls.includes(blogToDelete.url));
  });

  test('fails with status code 401 if an auth token is not provided', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, helper.multipleBlogs.length);

    const urls = blogsAtEnd.map(blog => blog.url);
    assert(urls.includes(blogToDelete.url));
  });
});

describe('updating a blog', () => {
  test('a blog can be updated if the data is correct', async () => {
    const login = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    blogToUpdate.title = 'new blog title';

    const updatedBlog = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(blogToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(updatedBlog.body.title, blogToUpdate.title);
  });

  test('the blog update fails if the title is missing', async () => {
    const login = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    blogToUpdate.title = '';

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(blogToUpdate)
      .expect(400);
  });

  test('the blog update fails if the url is missing', async () => {
    const login = await api
      .post('/api/login')
      .send(rootUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    blogToUpdate.url = '';

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .send(blogToUpdate)
      .expect(400);
  });
});

after(async () => {
  await mongoose.connection.close();
});
