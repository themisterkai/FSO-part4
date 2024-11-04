const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const testHelper = require('./test_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(testHelper.listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test('returns 0 if the blog list is empty', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('returns the right total for multiple blogs', () => {
    const result = listHelper.totalLikes(testHelper.multipleBlogs);
    assert.strictEqual(result, 42);
  });
});

describe('favorite blogs', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.favoriteBlog(testHelper.listWithOneBlog);
    assert.deepStrictEqual(result, testHelper.listWithOneBlog[0]);
  });

  test('should return an empty {} if the blog list is empty', () => {
    const result = listHelper.favoriteBlog([]);
    assert.deepStrictEqual(result, {});
  });

  test('should return the first blog in the list with the highest likes if there are multiple with the same likes', () => {
    const result = listHelper.favoriteBlog(testHelper.multipleBlogs);
    assert.deepStrictEqual(result, testHelper.multipleBlogs[2]);
  });
});

describe('most blogs', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.mostBlogs(testHelper.listWithOneBlog);
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 1,
    });
  });

  test('should return an empty {} if the blog list is empty', () => {
    const result = listHelper.mostBlogs([]);
    assert.deepStrictEqual(result, {});
  });

  test('should return the first author when there are multiple authors with the same number of blogs', () => {
    const result = listHelper.mostBlogs(testHelper.multipleBlogs);
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 3,
    });
  });
});

describe('most likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.mostLikes(testHelper.listWithOneBlog);
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 5,
    });
  });

  test('should return an empty {} if the blog list is empty', () => {
    const result = listHelper.mostLikes([]);
    assert.deepStrictEqual(result, {});
  });

  test('should return the author with most likes and the total number of likes', () => {
    const result = listHelper.mostLikes(testHelper.multipleBlogs);
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 22,
    });
  });
});
