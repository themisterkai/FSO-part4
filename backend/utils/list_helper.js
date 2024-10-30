const lodash = require('lodash');

const dummy = blogs => {
  return 1;
};

const totalLikes = blogs =>
  blogs.reduce((total, blog) => total + blog.likes, 0);

const favoriteBlog = blogs => {
  if (blogs.length === 0) {
    return {};
  }
  return blogs.reduce(
    (favorite, blog) => (blog.likes > favorite.likes ? blog : favorite),
    blogs[0]
  );
};

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return {};
  }
  return lodash(blogs)
    .countBy('author')
    .map((blogs, author) => ({ author, blogs }))
    .maxBy('blogs');
};

const mostLikes = blogs => {
  if (blogs.length === 0) {
    return {};
  }
  return lodash(blogs)
    .groupBy('author')
    .map((blog, author) => {
      return {
        author,
        likes: lodash.sumBy(blog, 'likes'),
      };
    })
    .maxBy('likes');
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
