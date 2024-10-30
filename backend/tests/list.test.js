const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
];

const multipleBlogs = [
  {
    _id: '5a422aa71b54a676234d17f9',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 10,
    __v: 0,
  },
];

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe('total likes', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test('returns 0 if the blog list is empty', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('returns the right total for multiple blogs', () => {
    const result = listHelper.totalLikes(multipleBlogs);
    assert.strictEqual(result, 42);
  });
});

describe('favorite blogs', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog);
    assert.deepStrictEqual(result, listWithOneBlog[0]);
  });

  test('should return an empty {} if the blog list is empty', () => {
    const result = listHelper.favoriteBlog([]);
    assert.deepStrictEqual(result, {});
  });

  test('should return the first blog in the list with the highest likes if there are multiple with the same likes', () => {
    const result = listHelper.favoriteBlog(multipleBlogs);
    assert.deepStrictEqual(result, multipleBlogs[2]);
  });
});

describe('most blogs', () => {
  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.mostBlogs(listWithOneBlog);
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
    const result = listHelper.mostBlogs(multipleBlogs);
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 3,
    });
  });
});

describe('most likes', () => {
  // test('when list has only one blog, equals the likes of that', () => {
  //   const result = listHelper.mostLikes(listWithOneBlog);
  //   assert.deepStrictEqual(result, {
  //     author: 'Edsger W. Dijkstra',
  //     likes: 5,
  //   });
  // });

  // test('should return an empty {} if the blog list is empty', () => {
  //   const result = listHelper.mostLikes([]);
  //   assert.deepStrictEqual(result, {});
  // });

  test('should return the author with most likes and the total number of likes', () => {
    const result = listHelper.mostLikes(multipleBlogs);
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 22,
    });
  });
});
