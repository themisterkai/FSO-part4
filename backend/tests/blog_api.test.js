const { test, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const supertest = require('supertest');
const mongoose = require('mongoose');
const helper = require('./test_helper');
const app = require('../app');
const api = supertest(app);

const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});
  console.log('cleared');

  for (let blog of helper.multipleBlogs) {
    const blogObject = new Blog(blog);
    await blogObject.save();
    console.log('saved');
  }
  console.log('done');
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('blogs are stored with a unique id', async () => {
  const response = await api.get('/api/blogs');

  const ids = response.body.map(blog => blog.id);
  const idSet = new Set(ids);
  assert.strictEqual(ids.length, idSet.size);
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'new author',
    url: 'https://newblog.com',
    likes: 1,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  assert.strictEqual(blogsAtEnd.length, helper.multipleBlogs.length + 1);

  const urls = blogsAtEnd.map(blog => blog.url);
  assert(urls.includes(newBlog.url));
});

test('sets likes to 0 if it was not set', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'new author',
    url: 'https://newblog.com',
  };
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  assert.strictEqual(response.body.likes, 0);
});

test('returns a 400 bad request if the title is not set', async () => {
  const newBlog = {
    author: 'new author',
    url: 'https://newblog.com',
  };
  await api.post('/api/blogs').send(newBlog).expect(400);
});

test('returns a 400 bad request if the url is not set', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'new author',
  };
  await api.post('/api/blogs').send(newBlog).expect(400);
});

after(async () => {
  await mongoose.connection.close();
});
